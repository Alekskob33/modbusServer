const { registers } = require('../../registers/registers.js');

const requestRouter = {
  // Read Register
  /** @param {Buffer} buffer */
  0x01: (buffer, parser) => registers.get('DO', { buffer, parser }),
  0x02: (buffer, parser) => registers.get('DI', { buffer, parser }),
  0x03: (buffer, parser) => registers.get('AO', { buffer, parser }),
  0x04: (buffer, parser) => registers.get('AI', { buffer, parser }),

  // Write Register
  0x05: (buffer) => registers.set('DO', buffer),
  0x06: (buffer) => registers.set('DI', buffer),

  // Write Multiple Registers
  0x0f: (buffer, parser) => registers.setMultiple('AO', { buffer, parser }),
  0x10: (buffer, parser) => registers.setMultiple('AI', { buffer, parser }),
};

module.exports = requestRouter;
