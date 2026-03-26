from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / 'docs' / 'control' / 'data'


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding='utf-8'))


def write_json(path: Path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def relpaths(paths):
    return sorted(str(path.relative_to(ROOT)) for path in paths)


def build_module_registry():
    source = ROOT / 'system' / 'module_registry.json'
    payload = load_json(source, {'registry_version': '0.0.0', 'modules': []})
    return payload


def build_config_summary():
    config_paths = list((ROOT / 'config').rglob('*.json')) if (ROOT / 'config').exists() else []
    return {
        'site_root': 'docs',
        'publish': 'gh-pages',
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'config_paths': relpaths(config_paths),
    }


def build_archive_summary():
    workflow_archives = []
    package_archives = []
    example_paths = []

    archives_dir = ROOT / 'archives'
    if archives_dir.exists():
        workflow_archives = list((archives_dir / 'workflows').rglob('*')) if (archives_dir / 'workflows').exists() else []
        workflow_archives = [p for p in workflow_archives if p.is_file()]
        package_archives = list((archives_dir / 'packages').rglob('*.zip')) if (archives_dir / 'packages').exists() else []

    examples_dir = ROOT / 'examples'
    if examples_dir.exists():
        example_paths = [p for p in examples_dir.rglob('*') if p.is_file() and p.suffix in {'.html', '.md', '.js', '.py'}]

    return {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'workflow_archives': relpaths(workflow_archives),
        'package_archives': relpaths(package_archives),
        'example_paths': relpaths(example_paths),
    }


def build_telemetry_history(mode: str):
    registry = build_module_registry()
    config_summary = build_config_summary()
    archive_summary = build_archive_summary()

    sha = os.getenv('GITHUB_SHA', 'local')
    ref = os.getenv('GITHUB_REF_NAME', 'local')

    events = [
        {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': 'info',
            'message': f'control snapshots generated in {mode} mode',
        },
        {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': 'info',
            'message': f'module count: {len(registry.get("modules", []))}',
        },
        {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': 'info',
            'message': f'config paths: {len(config_summary.get("config_paths", []))}',
        },
        {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'level': 'info',
            'message': f'package archives: {len(archive_summary.get("package_archives", []))}',
        },
    ]

    return {
        'heartbeat': '963Hz_primary / 786Hz_secondary',
        'deployment_state': f'{mode}-generated',
        'git': {
            'sha': sha,
            'ref': ref,
        },
        'events': events,
    }


def build_actions_catalog():
    return {
        'actions': [
            {
                'id': 'health-check',
                'label': 'Health Check',
                'scope': 'ui',
                'effect': 'Render current status and confirm canonical payload readiness.',
            },
            {
                'id': 'sync-audit',
                'label': 'Sync Audit',
                'scope': 'ui',
                'effect': 'Show synchronization and cleanup state summary from generated snapshots.',
            },
            {
                'id': 'open-docs',
                'label': 'Open Docs Payload',
                'scope': 'navigation',
                'effect': 'Navigate to the public docs payload and reference layer.',
            },
            {
                'id': 'show-cleanup',
                'label': 'Show Cleanup State',
                'scope': 'ui',
                'effect': 'Expose cleanup baseline and folder normalization status.',
            },
            {
                'id': 'show-registry',
                'label': 'Show Module Registry',
                'scope': 'ui',
                'effect': 'Display module registry snapshot loaded from generated JSON.',
            },
            {
                'id': 'show-canonical-paths',
                'label': 'Canonical Paths',
                'scope': 'ui',
                'effect': 'Display the repository canonical zones after cleanup.',
            },
        ]
    }


def generate(mode: str):
    write_json(DATA_DIR / 'module-registry.json', build_module_registry())
    write_json(DATA_DIR / 'config-summary.json', build_config_summary())
    write_json(DATA_DIR / 'archive-summary.json', build_archive_summary())
    write_json(DATA_DIR / 'telemetry-history.json', build_telemetry_history(mode))
    write_json(DATA_DIR / 'actions-catalog.json', build_actions_catalog())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['validate', 'deploy', 'local'], default='local')
    args = parser.parse_args()
    generate(args.mode)
    print(f'control snapshots generated in {args.mode} mode at {DATA_DIR}')


if __name__ == '__main__':
    main()
