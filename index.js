const http = require('http');
const fs = require('fs');

var base_html = fs.createReadStream("./base.html", 'utf8');
var base_css = fs.createReadStream("./style.css", 'utf8');
var base_js = fs.createReadStream("./app.js", 'utf8');

http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(req.method);
  // console.log(req.headers);

  switch (req.url) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' })
      //res.write(base_html)
      base_html.pipe(res);
      //res.end();
      break;

    case '/style.css':
      res.writeHead(200, { 'Content-Type': 'text/css' })
      //res.write(base_css)
      base_css.pipe(res);
      //res.end();
      break;

    case '/app.js':
      res.writeHead(200, { 'Content-Type': 'text/javascript' })
      //res.write(base_js)
      base_js.pipe(res);
      //res.end();
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Не найдено');

  }
}).listen(3000, () => console.log('Сервер работает'));
