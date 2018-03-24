const chatApp = require('./chat').ChatApp;
const chatOnMessage = require('./chat').chatOnMessage;
const readyToAnswer = require('./chat').readyToAnswer;

let vkChat = new chatApp('---------vk');
vkChat.on('message', chatOnMessage);
vkChat.setMaxListeners(2); 
vkChat.on('message', readyToAnswer('Готовлюсь к ответу'));

vkChat.on('close', () => console.log('Чат вконтакте закрылся :('));
vkChat.close();

setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
vkChat.removeListener('message', chatOnMessage);
}, 10000 );

module.exports = vkChat;