const bufferToString = require('../tcpServer/libs/util.js');
const writeInConsole = require('./writeInConsole.js');
const writeInFile = require('./writeInFile.js');

const logger = {
  error(msg, err) {
    if (msg instanceof Error) {
      writeInFile('error', '', msg);
      writeInConsole('error', '', msg);
      return;
    }
    writeInFile('error', msg, err);
    writeInConsole('error', msg, err);
  },
  info(msg) {
    writeInFile('info', msg);
    writeInConsole('info', msg);
  },
  debug(msg) {
    writeInFile('debug', msg);
    writeInConsole('debug', msg);
  },
  warn(msg) {
    writeInFile('warn', msg);
    writeInConsole('warn', msg);
  },
};

// Экспортируем logger, чтобы другие модули могли его использовать
module.exports = logger;

// Данные для примера
// const buffer = Buffer.from([0x10, 0xff]);
// const requestBuffer = bufferToString(buffer);
// const str = JSON.stringify(buffer);
// try {
//   const a = b.ss * 10;
// } catch (err) {
//   logger.error(`Test error: ${err}`);
// }

// Примеры использования логгера
// logger.error(`Error: fail to send the request ${buffer}`);
// logger.info('The response sent to client');
// logger.debug('Debug info:', { value: 42 });

/* 
example of log details
[2025-05-12T17:36:40.201Z] [INFO] Modbus-TCP Server started on port 502
[2025-05-12T17:36:40.208Z] [INFO] Client connected: ::ffff:127.0.0.1:63150
[2025-05-12T17:36:40.209Z] [DEBUG] Received request: Function=3 (Read Holding Registers), Address=4096, Count=10, TransactionID=1
[2025-05-12T17:36:40.210Z] [INFO] Response sent to client ::ffff:127.0.0.1:63150: Function=3, Status=Success, ProcessingTime=1ms
[2025-05-12T17:36:45.302Z] [ERROR] Invalid register access: Client ::ffff:127.0.0.1:63150, Function=6, Address=8000 (Out of range)
[2025-05-12T17:36:50.405Z] [WARN] Client ::ffff:127.0.0.1:63150 disconnected unexpectedly
*/
