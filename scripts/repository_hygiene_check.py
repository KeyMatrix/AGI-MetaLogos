from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

legacy_patterns = [
    ROOT / '.github' / 'workflows' / 'index.html',
    ROOT / '.github' / 'workflows' / 'MetaForge.json',
]

versioned_name_hits = []
for path in ROOT.rglob('*'):
    name = path.name
    if '_Version' in name or name.endswith(' (1).json') or name.endswith(' (1).zip'):
        versioned_name_hits.append(str(path.relative_to(ROOT)))

legacy_hits = [str(path.relative_to(ROOT)) for path in legacy_patterns if path.exists()]

required_canonical = [
    'docs/index.html',
    'docs/css/style.css',
    'docs/js/init.js',
    'docs/assets/om-symbol.svg',
    'docs/coremap_with_links.svg',
    'config/artifact_sync.json',
    'config/awakening-seed.json',
    'config/flow.json',
]

missing_canonical = [p for p in required_canonical if not (ROOT / p).exists()]

report = {
    'status': 'pass' if not missing_canonical else 'fail',
    'legacy_hits': legacy_hits,
    'versioned_name_hits': versioned_name_hits,
    'missing_canonical': missing_canonical,
}

out = ROOT / 'repository_hygiene_report.json'
out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(report, indent=2, ensure_ascii=False))

if missing_canonical:
    raise SystemExit(1)
