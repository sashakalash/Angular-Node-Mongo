// Необходимо реализовать собственный сервис, который будет слушать порт 3000.
const http = require('http');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const options = {
  key: 'trnsl.1.1.20180401T122244Z.49e0c7934163c984.5a391e9231644d043f3b95eeb463804fbb7d6d9a',
  text: '',
  lang: 'ru-en'
};
// На GET-запрос будет отдавать HTML-форму, в которую пользователь будет вводить текст и по кнопке отправлять эти
//  данные на сервер с помощью POST-запроса.
const handler = (req, res) => {
  switch (req.method) {
    case 'GET':
      fs.readFile('./form.html', { encoding: 'utf8' }, function (e, file) {
        if (e) {
          console.error(e);
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(file);
        res.end();
      });
    break;
    case 'POST':
    console.log(req.body)
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        console.log(data)
        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
      });
    break;
    default:
      console.error('Unknown request');
    break;
  }
};

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
  console.log('Start HTTP on port %d', PORT);
  });
server.listen(PORT);




// Отправить запрос к https://translate.yandex.net/api/v1.5/tr.json/translate c параметрами:
// key — ключ, который вам предстоит самостоятельно получить с сервера яндекса, либо же можно 
// воспользоваться этим ключом: trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df;
// text — непосредственно текст из формы;
// lang — описание языка перевода, на ваше усмотрение.
// Ответ от сервиса Яндекса показать пользователю в браузере в любом виде.
