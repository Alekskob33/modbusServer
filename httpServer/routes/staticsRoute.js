const path = require('path');
const fs = require('fs');

const contentTypeMap = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

function staticsRoute({ url, res }) {
  const ext = path.extname(url);
  if (!ext || !contentTypeMap[ext]) return false; // unexpected extension

  const filePath = path.join(__dirname, '../static', url);
  fs.readFile(filePath, (err, staticFile) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`File ${filePath} not found`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypeMap[ext] });
    res.end(staticFile);
  });
  return true;
}

module.exports = staticsRoute;
