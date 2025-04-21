const { ModbusClient } = require('./modbusClient.js');
const {
  reqBuilder,
  pdu0x01,
  pdu0x03,
  pdu0x05,
  pdu0x06,
  pdu0x0F,
  pdu0x10,
  pdu0x02,
  pdu0x04,
} = require('./requests.js');

function sendRequests(mode = 'RTU', { fnCode, slaveId = 1 }) {
  mode = mode.toLowerCase();
  const send = (mode, pdu) => {
    const req = reqBuilder[mode](pdu, { slaveId });
    new ModbusClient(mode).send(req);
  };

  const reqMap = {
    0x01() {
      send(mode, pdu0x01); // read DO
    },
    0x02() {
      send(mode, pdu0x02); // read DI
    },
    0x03() {
      send(mode, pdu0x03); // read AO
    },
    0x04() {
      send(mode, pdu0x04); // read AI
    },
    0x05() {
      send(mode, pdu0x05); // write single DO
    },
    0x06() {
      send(mode, pdu0x06); // write single AO
    },
    0x0f() {
      send(mode, pdu0x0F); // write multiple DO
    },
    0x10() {
      send(mode, pdu0x10); // write multiple AO
    },
  };

  // Send all requests
  if (!fnCode) {
    return Object.values(reqMap).forEach((handler) => handler());
  }
  // Send not-allowed fnCode
  if (!reqMap[fnCode]) {
    const pdu = Buffer.from([fnCode, 0, 0, 0, 1]); // unsupported fnCode
    return send(mode, pdu);
  }
  // Send one request
  reqMap[fnCode]();
}

module.exports = sendRequests;
