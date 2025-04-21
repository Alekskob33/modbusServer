const { calcCrc } = require('../rtuServer/response/helpers/crc.js');

const reqBuilder = {
  rtu(pdu, { slaveId }) {
    slaveId = Buffer.from([slaveId]);
    const req = Buffer.concat([slaveId, pdu]);
    const frame = Buffer.concat([req, calcCrc(req)]);
    return frame;
  },
  tcp(pdu) {
    const transaction = Buffer.alloc(2);
    const length = Buffer.alloc(2);
    const protocolId = Buffer.alloc(2);
    const unitId = Buffer.from([1]);
    transaction.writeUInt16BE(this.transactionId++);
    protocolId.writeUInt16BE(0);
    length.writeUInt16BE([pdu.length + 1]);

    const mbapHeader = Buffer.concat([transaction, protocolId, length, unitId]);
    const req = Buffer.concat([mbapHeader, pdu]);

    return req;
  },
  transactionId: 0,
};

/* PDU */

// read DO, DI
const pdu0x01 = Buffer.from([0x01, 0, 0, 0, 1]);
const pdu0x02 = Buffer.from([0x02, 0, 0, 0, 1]);
// read AO, AI
const pdu0x03 = Buffer.from([0x03, 0, 0, 0, 1]);
const pdu0x04 = Buffer.from([0x04, 0, 0, 0, 1]);
// write single DO
const pdu0x05 = Buffer.from([5, 0x00, 0x28, 0xff, 0x00]); // 41st bit (starts from 0)
// write single AO
const pdu0x06 = Buffer.from([6, 0x00, 0x28, 0x00, 0xff]); // 41st register (starts from 0)
// write multiple DO
const pdu0x0F = Buffer.concat([
  Buffer.from([0x0f]), // fnCode

  Buffer.from([0]), // StartAddr High
  Buffer.from([0x03]), // 4; StartAddr Low / starts from 0

  Buffer.from([0]), // registersCount High
  Buffer.from([0x12]), // 18; registersCount Low

  Buffer.from([3]), // bytes count
  Buffer.from([0b11111111, 0b11111111, 0b00000011]), // Values
]);
// write multiple AO
const pdu0x10 = Buffer.concat([
  Buffer.from([0x10]), // fnCode

  Buffer.from([0]), // StartAddr High
  Buffer.from([0x02]), // 3; StartAddr Low / starts from 0

  Buffer.from([0]), // registersCount High
  Buffer.from([0x02]), // registersCount Low

  Buffer.from([4]), // bytes count
  Buffer.from([0, 2, 0, 2]), // Values
]);

module.exports = {
  reqBuilder,
  pdu0x01,
  pdu0x02,
  pdu0x03,
  pdu0x04,
  pdu0x05,
  pdu0x06,
  pdu0x0F,
  pdu0x10,
};
