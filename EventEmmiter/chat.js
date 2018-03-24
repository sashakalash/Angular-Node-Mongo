const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
  }, 1000);
  }
  close() {
    this.emit('close');
  }
}

let chatOnMessage = (message) => {
  console.log(message);
};

let readyToAnswer = (mess) => () => chatOnMessage(mess);

module.exports = {
  ChatApp,
  chatOnMessage,
  readyToAnswer
};














