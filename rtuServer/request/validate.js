const rtuRequestParser = require('./rtuRequestParser.js');
const setupObj = require('../../setup.json');
const { checkCrc } = require('../response/helpers/crc.js');
const logger = require('../../log/logger.js');

function validate(rtuRequest) {
  // Check RTU Address
  const { slaveId } = rtuRequestParser.getParams(rtuRequest);
  const myId = setupObj.rtu.slaveId;
  if (slaveId !== myId) return;

  // Check CRC
  const isCorrectFrame = checkCrc(rtuRequest);
  if (!isCorrectFrame) {
    logger.error(`CRC error. Received bad frame.`);
    logger.debug(`Request: ${rtuRequest.buffer.toString('hex')}`);
    return;
  }
  return true;
}

module.exports = { validate };
