const fs = require('fs');
const path = require('path');
const corePath = path.join(__dirname, '../../../config/legacy/OM_Gate_Core_v3.json');
let core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));

function getAIAnswer(query) {
  return `[Resonance] Answer to "${query}" received via Core12.`;
}

function updateCoreState(data) {
  core = { ...core, ...data };
  fs.writeFileSync(corePath, JSON.stringify(core, null, 2));
}

module.exports = { getAIAnswer, updateCoreState };
