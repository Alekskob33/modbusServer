// BUG: в DO/DI сообщениях (ответах) значение регистра занимает 1 байт (не два).
// 1 бит - 1 регистр (DO/DI). Порядок нумерации справа налево.

// Вот какие значение устанавливаются в 'DO' при записи в них.
// Значение FF 00 hex устанавливает выход в значение включен ON.
// Значение 00 00 hex устанавливает выход в значение выключен OFF.

const rtuResponse = require('./helpers/rtuResponse.js');

const rtuResponseRouter = {
  0x01: rtuResponse.onRead,
  0x02: rtuResponse.onRead,
  0x03: rtuResponse.onRead,
  0x04: rtuResponse.onRead,

  0x05: (request) => request,
  0x06: (request) => request,

  0x0f: rtuResponse.onWriteMultiple,
  0x10: rtuResponse.onWriteMultiple,
};

module.exports = rtuResponseRouter;
