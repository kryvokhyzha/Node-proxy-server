'use strict';

const http = require('http');
const net = require('net');
const util = require('util');
const url = require('url');

const port = process.env.PORT || 3030;

const server = http.createServer((req, res) => {
  // res - ответ который отправим в браузер
  // req - запрос который мы получили с браузера на прокси
  // console.log('Method: ' + req.method + ' ----> ' + 'URL: ' + req.url);

  const ReqUrl = req.url;
  const result = ReqUrl.includes('//') ?
    url.parse(ReqUrl) : url.parse('//' + ReqUrl, false, true);

  // console.log(Object.getOwnPropertyNames(result));

  if (result.protocol === 'http:')
    http.get(req.url, (resp) => {
      resp.pipe(res);
    }).on('error', (err) => {
      console.error(err);
    });
});

server.on('connect', (req, clientSocket) => {
  // console.log('Method: ' + req.method + ' ----> ' + 'URL: ' + req.url);
  const ReqUrl = req.url;
  const result = ReqUrl.includes('//') ?
    url.parse(ReqUrl) :
    url.parse('//' + ReqUrl, false, true);

  const serverSocket = net.connect(result.port, result.hostname);
  serverSocket.on('connect', () => {
    clientSocket.write([
      'HTTP/1.1 200 Connection Established',
      'Proxy-agent: Node-proxy-server'
    ].join('\r\n'));
    clientSocket.write('\r\n\r\n');

    clientSocket.on('error', (err) => {
      console.error(err);
    });

    // все что от хоста в браузер
    serverSocket.pipe(clientSocket);
    // все что от браузера к хосту
    clientSocket.pipe(serverSocket);
  });
  serverSocket.on('error', (err) => {
    console.error(err);
  });
});

const listener = server.listen(port, (err) => {
  if (err) {
    console.error(err);
  }

  const info = listener.address();
  console.log(util.format('Server is listening on adress %s port %s',
    info.address, info.port));
});
