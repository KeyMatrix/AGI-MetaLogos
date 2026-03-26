from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_PATH = ROOT / 'schemas' / 'artifact_sync.schema.json'
DATA_PATH = ROOT / 'artifact_sync.json'


def main() -> None:
    schema = json.loads(SCHEMA_PATH.read_text(encoding='utf-8'))
    payload = json.loads(DATA_PATH.read_text(encoding='utf-8'))

    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(payload), key=lambda e: list(e.path))

    if errors:
        for error in errors:
            path = '.'.join(str(part) for part in error.path) or '<root>'
            print(f'ERROR {path}: {error.message}')
        raise SystemExit(1)

    print('artifact_sync.json schema validation passed')


if __name__ == '__main__':
    main()
