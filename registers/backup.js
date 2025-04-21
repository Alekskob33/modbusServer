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

    this.timerId = setInterval(() => {
      if (!this.hasChanges) return;
      this.writeJSON();
    }, this.interval * 1000); // sec
  },
  stop(cb) {
    clearInterval(this.timerId);
    this.timerId = null;

    setTimeout(() => {
      cb();
    }, this.interval * 1000);
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
        this.stop();
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
