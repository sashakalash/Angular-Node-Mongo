// Необходимо реализовать собственный сервис, который будет слушать порт 3000.
const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 3000;
const fs = require('fs');

/* На GET-запрос будет отдавать HTML-форму,
  в которую пользователь будет вводить текст и по кнопке отправлять эти */
const sendForm = (res) => {
  fs.readFile('./form.html', { encoding: 'utf8' }, function (e, file) {
    if (e) {
      console.error(e);
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(file);
    res.end();
  });
};

/* Отправить запрос к https://translate.yandex.net/api/v1.5/tr.json/translate c параметрами:
key — ключ, который вам предстоит самостоятельно получить с сервера яндекса, 
text — непосредственно текст из формы;
lang — описание языка перевода, на ваше усмотрение.*/
const querystring = require('querystring');

const sendYaReq = (text) => {
  return new Promise((done, fail) => {

    const data = querystring.stringify({
      key: 'trnsl.1.1.20180401T122244Z.49e0c7934163c984.5a391e9231644d043f3b95eeb463804fbb7d6d9a',
      text: `${text}`,
      lang: 'ru-en',
      format: 'plain',
    });
  
    const opt = {
      hostname: 'translate.yandex.net',
      path: `/api/v1.5/tr.json/translate?${data}`,
      method: 'GET',
    };
    const request = https.request(opt, (res) => {
      let answer = '';
      res.on('data', (chunk) => {
        answer += chunk;
      });
      res.on('end', () => {
        done(answer);
      });
    });
  
    request.on('error', (e) => {
      fail(e);
    });
    request.end();
  });
};

//  данные на сервер с помощью POST-запроса.
const handler = (req, res) => {
  if (req.method == 'GET') {
    sendForm(res);
  } else {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      const text = data.split('\n')[3];
      sendYaReq(text)
        .then(result => {
          const translate = JSON.parse(result).text.toString();
          res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
          res.write(translate);
          res.end();
        })
        .catch(err => console.error(err));
    });
  }

};

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', PORT);
  });
server.listen(PORT);





// Ответ от сервиса Яндекса показать пользователю в браузере в любом виде.
