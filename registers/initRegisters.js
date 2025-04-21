const setupObj = require('../setup.json');
const { registers } = require('./registers.js');

function initRegisters() {
  const { registers: registersBackup } = setupObj.backup;
  if (!registersBackup) {
    throw new Error('No registers found in JSON file');
  }
  for (sectorName in registersBackup) {
    registersBackup[sectorName].forEach((value, index) => {
      registers[sectorName][index] = value;
    });
  }
}

module.exports = { initRegisters };
