# Final Wave Migration Report

## Canonical paths
- Public site: `docs/`
- Config: `config/`
- Architecture docs: `docs/architecture/`
- Runtime root fallback: repository root (`index.html`, `init.js`, `style.css`)

## Legacy paths detected
- `.github/workflows/index.html`
- `.github/workflows/MetaForge.json`

## Target outcome
1. Remove runtime/UI files from `.github/workflows/`
2. Keep workflow directory for CI/CD definitions only
3. Use `docs/` as the canonical GitHub Pages payload
4. Use `config/` for normalized JSON runtime/config inputs
5. Keep architecture validation and hygiene audit active on PRs

## Notes
This PR introduces canonical replacements and automated checks. Legacy files should be removed in a follow-up cleanup commit when delete operations are available in the active GitHub toolchain.
