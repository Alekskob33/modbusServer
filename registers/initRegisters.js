const setupObj = require('../setup.json');
const { registers: registersStore } = require('./registers.js');

function initRegisters() {
  const { registers: registersBackup } = setupObj.backup;
  if (!registersBackup) {
    throw new Error('No registers found in JSON file');
  }
  for (sectorName in registersBackup) {
    registersBackup[sectorName].forEach((value, index) => {
      registersStore[sectorName][index] = value;
    });
  }
}

module.exports = { initRegisters };
