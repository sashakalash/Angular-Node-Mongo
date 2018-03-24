const chatApp = require('./chat').ChatApp;
const chatOnMessage = require('./chat').chatOnMessage;
const readyToAnswer = require('./chat').readyToAnswer;

let webinarChat = new chatApp('webinar');
webinarChat.on('message', chatOnMessage);
webinarChat.on('message', readyToAnswer('Готовлюсь к ответу'));

setTimeout(() => {
  webinarChat.removeListener('message', chatOnMessage);
}, 30000);

module.exports = webinarChat;