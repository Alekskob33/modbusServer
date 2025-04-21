const fs = require('fs');
const path = require('path');
const { registers } = require('./registers.js');
const setupObj = require('../setup.json');
const logger = require('../log/logger.js');

const registersBackup = {
  filePath: path.join(__dirname, '../setup.json'),
  interval: setupObj.backup.interval || 5,
  timerId: null,

  run() {
    this.writeJSON();

    this.interval = setInterval(() => {
      if (!this.hasChanges) return;
      this.writeJSON();
    }, this.interval * 1000); // sec
  },

  writeJSON() {
    setupObj.backup.registers = {
      DO: Array.from(registers.DO),
      DI: Array.from(registers.DI),
      AO: Array.from(registers.AO),
      AI: Array.from(registers.AI),
    };
    fs.writeFile(this.filePath, JSON.stringify(setupObj, null, 2), (err) => {
      if (err) {
        this.timerId = null;
        return logger.error(`Backup error: ${err.message}`);
      }
    });
  },

  get hasChanges() {
    return (
      JSON.stringify(setupObj.backup.registers) !== JSON.stringify(registers)
    );
  },
};

module.exports = registersBackup;
