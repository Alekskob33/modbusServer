const logger = require('./log/logger.js');
const { initRegisters } = require('./registers/initRegisters.js');
const registersBackup = require('./registers/backup.js');
const startRtuServer = require('./rtuServer/rtuServer.js');
const startHttpServer = require('./httpServer/httpServer.js');
const startModbusTcpServer = require('./tcpServer/tcpServer.js');
const sendRequests = require('./clients/sendRequests.js');
const { handleNodeEvents } = require('./NodeErrors.js');

// Handle Node errors
handleNodeEvents();

try {
  initRegisters();
  logger.info('Init registers from JSON');
} catch (error) {
  logger.error('Error initializing registers:', error.message);
  logger.info('Exiting process...');
  process.exit(1);
}

// TCP Server: run
startModbusTcpServer();
// RTU Server: run
startRtuServer();
// HTTP Client: requests logs
startHttpServer();

// Save registers state
registersBackup.run();

// Change to check backup (no requests)
// registers.AO[1] = 0x00f0;
// registers.AO[2] = 0x00f0;
// registers.AO[3] = 0x00f0;

/* TEST CLIENTS (parallel requests) */
// sendRequests('tcp', { fnCode: 0x01 }); // 0x01-0x06, 0x0f-0x10
// sendRequests('rtu', { fnCode: 0x01 }); // 0x01-0x06, 0x0f-0x10

// sendRequests('tcp', { fnCode: 20 }); // not supported
// sendRequests('rtu', { fnCode: 20 }); // not supported

// sendRequests('tcp', { fnCode: '' }); // all supported
// sendRequests('rtu', { fnCode: '' }); // all supported

// sendRequests('rtu', { fnCode: 0x01, slaveId: 2 }); // RTU frame to another Slave
