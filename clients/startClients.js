const { calcCrc } = require('../rtuServer/response/helpers/crc.js');
const { ModbusClient } = require('./modbusClient.js');

// TCP Client: send request
const tcpFrame = Buffer.from([
  0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x01, 0x03, 0x00, 0x00, 0x00, 0x01,
]);
new ModbusClient('TCP').send(tcpFrame);

// RTU Client: send request
const rtuBuffer = Buffer.from([1, 3, 0, 0, 0, 1]);
const rtuFrame = Buffer.concat([rtuBuffer, calcCrc(rtuBuffer)]);
new ModbusClient('RTU').send(rtuFrame);
