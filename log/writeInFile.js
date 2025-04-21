const formatMsg = require('./formatMsg.js');
const fs = require('fs');
const path = require('path');
const setupFile = require('../setup.json');
const logFileName = setupFile.log.fileName;

const logFilePath = path.join(__dirname, '../', logFileName);
const stream = fs.createWriteStream(logFilePath, {
  encoding: 'utf-8',
  flags: 'a',
});

function writeInFile(status, msg, error) {
  const logMsg = formatMsg(status, msg);
  stream.write(logMsg + (error ? JSON.stringify(error) : '') + '\n', (err) => {
    if (err) {
      console.error('Error writing in log file:', err);
      return;
    }
  });
}

module.exports = writeInFile;
