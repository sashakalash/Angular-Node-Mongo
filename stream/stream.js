const crypto = require('crypto');
const hash = crypto.createHash('md5');

const readable = require('stream').Readable;

class cReadable extends readable {
  constructor(options) {
    super(options);
    this.count = 0;
  }
  _read() {
    const result = this.push(this.count.toString());
  }
}

const input = new cReadable();
input.on('readable', () => {
  let data;
  // while (data = input.read()) {
  //   console.log(data);
  // }
});