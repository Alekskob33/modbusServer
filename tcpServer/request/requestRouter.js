const { registers } = require('../../registers/registers.js');

const requestRouter = {
  // Read Register
  /** @param {Buffer} buffer */
  0x01: (buffer, parser) => registers.get('DO', { buffer, parser }),
  0x02: (buffer, parser) => registers.get('DI', { buffer, parser }),
  0x03: (buffer, parser) => registers.get('AO', { buffer, parser }),
  0x04: (buffer, parser) => registers.get('AI', { buffer, parser }),

  // Write Register
  0x05: (buffer, parser) => registers.set('DO', { buffer, parser }),
  0x06: (buffer, parser) => registers.set('AO', { buffer, parser }),

  // Write Multiple Registers
  0x0f: (buffer, parser) => registers.setMultiple('DO', { buffer, parser }),
  0x10: (buffer, parser) => registers.setMultiple('AO', { buffer, parser }),
};

module.exports = requestRouter;
