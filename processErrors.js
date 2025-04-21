const logger = require('./log/logger.js');

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at promise ${promise}. Reason: ${reason}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception thrown: ${err}`);
  process.exit(1);
});

// Shutdown
process.on('SIGNINT', () => {
  logger.warn('Received SIGINT. Shutting down gracefully...');
});
