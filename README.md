# KeyMatrix / AGI-MetaLogos

Канонический репозиторий KeyMatrix после cleanup, нормализации структуры, сборки control center и автоматизации snapshots.

## Архитектура репозитория

Активная структура сведена к пяти каноническим зонам:

- `docs/` — публичный payload для GitHub Pages, документация и интерфейсы управления.
- `src/` — активный код: CLI, сервисы и движки.
- `config/` — нормализованные конфиги и совместимый legacy-слой.
- `examples/` — примеры интерфейсов и интеграций.
- `archives/` — архивные workflow- и package-артефакты.

Дополнительные системные артефакты:

- `system/` — registry и архитектурные JSON-описания.
- `.github/workflows/` — компактный контур `validate / deploy / security`.

## Control Center

В репозитории уже собран интерфейс управления:

- `docs/control/index.html` — базовый control center.
- `docs/control/v3/index.html` — multipage control center.

### Multipage navigation v3

Третья волна интерфейса включает:

- `overview`
- `modules`
- `configs`
- `archives`
- `telemetry`
- `actions`

## Auto-generated snapshots

Control UI использует snapshots в `docs/control/data/`:

- `module-registry.json`
- `config-summary.json`
- `archive-summary.json`
- `telemetry-history.json`
- `actions-catalog.json`

Эти файлы больше не должны поддерживаться вручную: они генерируются автоматически из CI/CD.

## CI / CD

В репозитории оставлен компактный workflow-контур:

- `.github/workflows/validate.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/security.yml`

### Validate

`validate.yml`:

- генерирует control snapshots
- валидирует ключевые JSON-манифесты
- проверяет канонические docs/config paths
- публикует snapshots как artifact

### Deploy

`deploy.yml`:

- генерирует control snapshots
- проверяет docs payload
- публикует `docs/` через GitHub Pages

### Security

`security.yml`:

- запускает CodeQL для JavaScript и Python слоя

## Канонические точки входа

- `docs/index.html`
- `docs/control/index.html`
- `docs/control/v3/index.html`
- `docs/architecture/keymatrix-master-blueprint.json`
- `system/module_registry.json`

## Текущее состояние

На текущем этапе репозиторий уже приведён к канонической инженерной базе:

- legacy workflow assets удалены из активного слоя
- корневые versioned-артефакты нормализованы
- дублирующие модульные папки выведены из активного дерева
- control center собран
- multipage control center v3 собран
- snapshots автоматизированы через validate/deploy

## Назначение репозитория

Этот репозиторий теперь служит как:

- архитектурная база KeyMatrix
- deployable docs/control payload
- нормализованный исходный слой для дальнейшей инженерной сборки
- основа для telemetry, orchestration и дальнейшей автоматизации
