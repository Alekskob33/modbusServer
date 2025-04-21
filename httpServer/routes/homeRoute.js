const path = require('path');
const fs = require('fs');

function homeRoute({ url, res }) {
  if (url === '/') {
    const docPath = path.join(__dirname, '../static/index.html');
    fs.readFile(docPath, (err, html) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('no index.html found');
        console.error(`[HTTP Server] Error: missing index.html`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
    return true;
  }
}

module.exports = homeRoute;
