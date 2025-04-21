const logger = require('../../../log/logger.js');
const { checkCrc } = require('../../response/helpers/crc.js');
const rtuRequestParser = require('../rtuRequestParser.js');
const setupObj = require('../../../setup.json');
const frameTimeout = require('../timeout.js');

function checkSlaveId(rtuRequest) {
  const { slaveId } = rtuRequestParser.getParams(rtuRequest);
  if (!slaveId) return;

  const myId = setupObj.rtu.slaveId;
  if (slaveId !== myId) {
    return logger.warn(`Skip rtu-request directing for slaveId=${slaveId}`);
  }
  return true;
}

function checkByCRC(rtuRequest) {
  const isCorrectFrame = checkCrc(rtuRequest);
  if (!isCorrectFrame) {
    return logger.warn(`Skip rtu-request by CRC check.`);
  }
  return true;
}

function checkRtuTimeout() {
  if (frameTimeout.finished) {
    return logger.warn('Frame timeout. Receive new chunk...');
  }
  return true;
}

module.exports = { checkSlaveId, checkByCRC, checkRtuTimeout };
