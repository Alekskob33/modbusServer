const rtuRequestParser = require('../../request/rtuRequestParser.js');

function calcCrc(rtuFrameBuffer) {
  const targetFrame = rtuFrameBuffer.slice(0, -2); // Exclude CRC bytes
  let crc = 0xffff; // Initial CRC value

  for (let i = 0; i < targetFrame.length; i++) {
    crc ^= targetFrame[i]; // XOR with the byte
    for (let j = 0; j < 8; j++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ 0xa001; // Shift right and XOR with polynomial
      } else {
        crc >>= 1; // Just shift right
      }
    }
  }
  return Buffer.from([crc & 0xff, (crc >> 8) & 0xff]); // Return CRC as Buffer
}

function checkCrc(requestBuffer) {
  const { crc } = rtuRequestParser.getParams(requestBuffer);
  const targetFrame = requestBuffer.slice(0, -2); // Exclude CRC bytes
  const realCRC = calcCrc(targetFrame);

  return crc === realCRC.readUInt16BE(0);
}

module.exports = {
  calcCrc,
  checkCrc,
};
