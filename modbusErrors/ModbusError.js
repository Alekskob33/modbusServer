const buildModbusErrorResponse = require('./buildErrorResponse.js');

class ModbusError extends Error {
  constructor(message, { mode, request, errorCode }) {
    super(message);
    this.name = 'ModbusError';

    this.errorResponse = buildModbusErrorResponse(mode, request, errorCode);
  }
}

module.exports = ModbusError;
