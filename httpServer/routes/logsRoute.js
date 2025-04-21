const logFileName = require('../../setup.json').log.fileName;
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, '../../', logFileName);

function logsRoute({ url, method, res }) {
  if (url === `/log` && method.toLowerCase() === 'get') {
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
      // 404 Error
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${logFileName}`);
        console.error(`[HTTP Server] Missing ${logFileName}`);
        return;
      }

      // Success: send file
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      const stream = fs.createReadStream(logFilePath);
      stream.pipe(res);

      stream.on('error', (streamErr) => {
        res.writeHead(500);
        res.end(`Error reading file: ${logFileName}`);
        console.error(`[HTTP Server] Can't read ${logFileName}`, streamErr);
      });
    });
    return true;
  }
}

module.exports = logsRoute;
