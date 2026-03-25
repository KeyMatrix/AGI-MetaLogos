const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manifestPath = path.join(root, 'artifact_sync.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error('artifact_sync.json not found');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const candidateArtifacts = [
  'index.html',
  'web_interface.html',
  'coremap_with_links.svg',
  'docs/architecture/keymatrix-master-blueprint.json',
  'docs/architecture/platform-contract.json',
  'system/module_registry.json'
];

manifest.artifacts = candidateArtifacts.filter((file) => fs.existsSync(path.join(root, file)));
manifest.last_sync = new Date().toISOString();

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('artifact_sync complete');
console.log(JSON.stringify(manifest, null, 2));
