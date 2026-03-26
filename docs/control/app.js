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
  head.className = className.indexOf('status') >= 0 ? 'status-label' : className.indexOf('module') >= 0 ? 'module-title' : className.indexOf('zone') >= 0 ? 'zone-title' : 'summary-title';
  head.textContent = title;
  const main = document.createElement('div');
  main.className = className.indexOf('summary') >= 0 ? 'summary-value' : '';
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

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('failed to load ' + path);
  }
  return response.json();
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

function renderSummary(targetId, entries) {
  const node = document.getElementById(targetId);
  node.innerHTML = '';
  entries.forEach((entry) => {
    node.appendChild(createBlock('summary-item', entry.title, entry.value, entry.extra));
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
    'show-registry': ['registry snapshot loaded from docs/control/data/module-registry.json'],
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

async function bootSnapshots() {
  try {
    const registry = await loadJson('./data/module-registry.json');
    renderSummary('registry-summary', [
      { title: 'registry_version', value: registry.registry_version || 'n/a' },
      { title: 'modules', value: String((registry.modules || []).length) },
      { title: 'critical modules', value: String((registry.modules || []).filter((m) => m.criticality === 'critical').length) }
    ]);

    const config = await loadJson('./data/config-summary.json');
    renderSummary('config-summary', [
      { title: 'site_root', value: config.site_root },
      { title: 'publish', value: config.publish },
      { title: 'active configs', value: String(config.config_paths.length) }
    ]);

    const archives = await loadJson('./data/archive-summary.json');
    renderSummary('archive-summary', [
      { title: 'workflow archives', value: String(archives.workflow_archives.length) },
      { title: 'package archives', value: String(archives.package_archives.length) },
      { title: 'examples', value: String(archives.example_paths.length) }
    ]);

    appendLog(['snapshot boot :: registry / config / archive loaded']);
  } catch (error) {
    appendLog(['snapshot boot :: error', error.message]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderStatus();
  renderModules();
  renderZones();
  wireActions();
  appendLog(['system-control-interface :: ready']);
  bootSnapshots();
});
