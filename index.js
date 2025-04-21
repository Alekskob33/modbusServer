const logger = require('./log/logger.js');
const { initRegisters } = require('./registers/initRegisters.js');
const { registers } = require('./registers/registers.js');
const registersBackup = require('./registers/backup.js');
const startRtuServer = require('./rtuServer/rtuServer.js');
const startHttpServer = require('./httpServer/httpServer.js');
const startModbusTcpServer = require('./tcpServer/tcpServer.js');

// Handle errors in registers
require('./processErrors.js');

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

/* TEST CLIENTS */
require('./clients/startClients.js');
