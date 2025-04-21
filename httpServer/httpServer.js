const http = require('http');

const homeRoute = require('./routes/homeRoute.js');
const logsRoute = require('./routes/logsRoute.js');
const staticsRoute = require('./routes/staticsRoute.js');

const HTTP_SERVER_IP = '127.0.0.1';
const PORT = 80;

const httpServer = http.createServer((req, res) => {
  const { url, method } = req;
  console.log(
    `[HTTP Server] Requests log-file by client: ${req.socket.remoteAddress}`
  );

  // Router
  if (homeRoute({ url, res })) return;
  if (logsRoute({ url, method, res })) return;
  if (staticsRoute({ url, res })) return;

  // 404 Error
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(`Route not found: ${url}`);
});

// Start HTTP Server
function startHttpServer() {
  httpServer.listen(PORT, HTTP_SERVER_IP, () => {
    console.log(`Web-Server ${HTTP_SERVER_IP}:${PORT} ready to share log-file`);
  });
}

module.exports = startHttpServer;
