#!/usr/bin/env bash
set -euo pipefail

required_files=(
  ".github/workflows/core-architecture-validation.yml"
  ".github/workflows/deploy-pages.yml"
  ".github/workflows/security-scan.yml"
  "docs/index.html"
  "config/artifact_sync.json"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing: $file"
    exit 1
  fi
  echo "ok: $file"
done

echo "workflow smoke test passed"
