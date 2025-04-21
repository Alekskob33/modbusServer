const rtuRequestParser = require('../../request/rtuRequestParser.js');

function calcCrc(buffer) {
  const targetFrame = buffer.slice(0); // Exclude CRC bytes
  if (targetFrame.length <= 1) return null;

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
  const result = Buffer.from([crc & 0xff, (crc >> 8) & 0xff]); // LSB first
  return result;
}

function checkCrc(requestBuffer) {
  const { crc } = rtuRequestParser.getParams(requestBuffer);
  if (!crc) return;

  const targetFrame = requestBuffer.slice(0, -2); // Exclude CRC bytes
  const realCRC = calcCrc(targetFrame);

  return crc === realCRC.readUInt16BE(0);
}

module.exports = {
  calcCrc,
  checkCrc,
};
