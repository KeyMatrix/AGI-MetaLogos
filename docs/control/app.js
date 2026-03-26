const systemState = {
  status: 'Operational',
  cleanupState: 'Canonical cleanup applied',
  deployment: 'Docs payload ready',
  ci: 'validate / deploy / security',
  branchModel: 'main + feature/* + cleanup/*',
  activeSurface: 'docs/ + src/ + config/ + examples/ + archives/'
};

const modules = [
  { name: 'MetaCore', role: 'reasoning / coordination', layer: 'L1_core' },
  { name: 'PrimeCore', role: 'optimization / priority engine', layer: 'L1_core' },
  { name: 'SyncCore', role: 'orchestration / autosync', layer: 'L2_runtime' },
  { name: 'Archivarius', role: 'memory / archive', layer: 'L1_core' },
  { name: 'MetaForge Services', role: 'discord / websocket / json bridge', layer: 'src/services/metaforge' },
  { name: 'DeepGlyph Engine', role: 'interactive glyph example engine', layer: 'src/engines' }
];

const zones = [
  { title: 'docs/', description: 'Публичный интерфейс, гайды, reference и payload для GitHub Pages.' },
  { title: 'src/', description: 'Канонический активный код: CLI, сервисы, движки.' },
  { title: 'config/', description: 'Нормализованные конфиги и legacy-конфиги.' },
  { title: 'examples/', description: 'UI-демо, интеграционные примеры и песочницы.' },
  { title: 'archives/', description: 'Версионированные workflow-артефакты и исторические пакеты.' }
];

function createBlock(className, title, body, extra) {
  const item = document.createElement('div');
  item.className = className;

  const head = document.createElement('div');
  head.className = className.indexOf('status') >= 0 ? 'status-label' : className.indexOf('module') >= 0 ? 'module-title' : 'zone-title';
  head.textContent = title;

  const main = document.createElement('div');
  main.textContent = body;

  item.appendChild(head);
  item.appendChild(main);

  if (extra) {
    const extraNode = document.createElement('div');
    extraNode.className = 'muted';
    extraNode.textContent = extra;
    item.appendChild(extraNode);
  }

  return item;
}

function renderStatus() {
  const grid = document.getElementById('status-grid');
  Object.keys(systemState).forEach((key) => {
    grid.appendChild(createBlock('status-item', key, systemState[key]));
  });
  document.getElementById('system-badge').textContent = systemState.status;
}

function renderModules() {
  const list = document.getElementById('modules-list');
  modules.forEach((module) => {
    list.appendChild(createBlock('module-item', module.name, module.role, module.layer));
  });
}

function renderZones() {
  const list = document.getElementById('zones-list');
  zones.forEach((zone) => {
    list.appendChild(createBlock('zone-item', zone.title, zone.description));
  });
}

function appendLog(lines) {
  const output = document.getElementById('log-output');
  const stamp = new Date().toLocaleTimeString();
  const rendered = lines.map((line) => '[' + stamp + '] ' + line).join('\n');
  output.textContent = rendered + '\n\n' + output.textContent;
}

function handleAction(action) {
  const map = {
    'health-check': ['health-check :: OK', 'docs payload :: present', 'src services :: normalized'],
    'sync-audit': ['sync-audit :: completed', 'active canonical paths :: docs / src / config / examples / archives'],
    'open-docs': ['docs payload includes:', 'docs/index.html', 'docs/control/index.html', 'docs/reference/keymatrix_sync.md'],
    'show-cleanup': ['cleanup state :: applied', 'legacy workflow assets :: removed', 'duplicate module folders :: normalized'],
    'show-registry': ['registry snapshot:', 'MetaCore', 'PrimeCore', 'MindState', 'Archivarius', 'SyncCore'],
    'show-canonical-paths': ['canonical paths:', 'docs/', 'src/', 'config/', 'examples/', 'archives/']
  };
  appendLog(map[action] || ['unknown action: ' + action]);
}

function wireActions() {
  const buttons = document.querySelectorAll('.action-button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => handleAction(button.getAttribute('data-action')));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderStatus();
  renderModules();
  renderZones();
  wireActions();
  appendLog(['system-control-interface :: ready']);
});
