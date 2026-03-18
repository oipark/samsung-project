const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/home.html' : req.url;
  file = path.join(ROOT, path.normalize(file).replace(/^(\.\.(\/|\\|$))+/, ''));
  const ext = path.extname(file);
  const type = mime[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  [자산현황 로컬 서버]');
  console.log('  이 PC:  http://localhost:' + PORT + '/');
  console.log('  다른 PC: http://본인IP:' + PORT + '/');
  console.log('');
});
