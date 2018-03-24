const chatApp = require('./chat').ChatApp;
const chatOnMessage = require('./chat').chatOnMessage;

let facebookChat = new chatApp('=========facebook');
facebookChat.on('message', chatOnMessage);

setTimeout( ()=> {
  console.log('Закрываю фейсбук, все внимание — вебинару!');

facebookChat.removeListener('message', chatOnMessage);
}, 15000 );

module.exports = facebookChat;