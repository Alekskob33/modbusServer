const ModbusError = require('../modbusErrors/ModbusError.js');
const { registers } = require('../registers/registers.js');
const tcpRequestParser = require('../tcpServer/request/tcpRequestParser.js');
const rtuRequestParser = require('../rtuServer/request/rtuRequestParser.js');

class ModbusValidator {
  constructor(mode, request) {
    this.mode = mode.toLowerCase(); // tcp/rtu
    this.request = request;
    this.parser = this.mode === 'tcp' ? tcpRequestParser : rtuRequestParser;
  }

  validate() {
    this.validateFnCode();
    this.validateAddress();
    this.validateNewValues();
    return true;
  }

  throwError(msg, { errorCode }) {
    throw new ModbusError(msg, {
      mode: this.mode,
      request: this.request,
      errorCode,
    });
  }

  validateFnCode() {
    const { fnCode } = this.parser.getParams(this.request);
    const allowedFnCodes = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x0f, 0x10];
    if (!allowedFnCodes.includes(fnCode)) {
      this.throwError('Function Code is not valid', { errorCode: 0x01 });
    }
    return true;
  }

  validateAddress() {
    const { fnCode, startAddr, quantity } = this.parser.getParams(this.request);
    const memorySectorMap = {
      0x01: registers.DO,
      0x02: registers.DI,
      0x03: registers.AO,
      0x04: registers.AI,
      0x05: registers.DO,
      0x06: registers.AO,
      0x0f: registers.DO,
      0x10: registers.AO,
    };
    const memorySector = memorySectorMap[fnCode];
    const endAddr = quantity ? startAddr + quantity : startAddr;
    if (
      memorySector[startAddr] === undefined ||
      memorySector[endAddr] === undefined
    ) {
      this.throwError('Register address is not valid', { errorCode: 0x02 });
    }
    return true;
  }

  validateNewValues() {
    const { fnCode, quantity, newValue, newValues } = this.parser.getParams(
      this.request
    );
    const values = newValue !== undefined ? newValue : newValues;
    const checkMap = {
      0x05: () => values === 0x0000 || values === 0xff00,
      0x06: () => values <= 0xffff, // any 2-bytes value is valid
      0x0f: () => {
        const bitsCount = values.length * 8; // 1 bit ~ 1 Coil/Input
        return bitsCount >= quantity;
      },
      0x10: () => {
        const registersCount = values.length / 2; // 1 register = 2 bytes
        return quantity === registersCount;
      },
    };
    if (checkMap[fnCode] && !checkMap[fnCode]()) {
      this.throwError('New value is not valid', { errorCode: 0x03 });
    }
    return true;
  }
}

module.exports = ModbusValidator;
