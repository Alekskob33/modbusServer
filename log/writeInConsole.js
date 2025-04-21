const formatMsg = require('./formatMsg.js');

function writeInConsole(status, msg, error) {
  const logMsg = formatMsg(status, msg);
  console[status](logMsg, error ? error : '');
}

module.exports = writeInConsole;
