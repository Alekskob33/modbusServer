const rtuRequestParser = require('../rtuServer/request/rtuRequestParser.js');
const { calcCrc } = require('../rtuServer/response/helpers/crc.js');
const tcpRequestParser = require('../tcpServer/request/tcpRequestParser.js');

function buildModbusErrorResponse(mode = 'rtu', request, errorCode) {
  mode = mode.toLocaleLowerCase();

  const getErrorResponse = {
    ['rtu']() {
      const { slaveId, fnCode } = rtuRequestParser.getParams(request);
      const responseFnCode = fnCode | (1 << 7);
      const errorBody = Buffer.from([slaveId, responseFnCode, errorCode]);
      const crc = calcCrc(errorBody);
      const errorResponse = Buffer.concat([errorBody, crc]);
      return errorResponse;
    },
    ['tcp']() {
      const { fnCode } = tcpRequestParser.getParams(request);
      const header = request.slice(0, 7);
      header.writeUInt16BE(3, 4); // change length
      const responseFnCode = Buffer.from([fnCode | (1 << 7)]);
      return Buffer.concat([header, responseFnCode, Buffer.from([errorCode])]);
    },
  };

  return getErrorResponse[mode]();
}

module.exports = buildModbusErrorResponse;
