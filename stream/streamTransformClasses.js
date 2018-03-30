const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const Transform = require('stream').Transform;
const Readble = require('stream').Readable;
const Writeble = require('stream').Writable;
const pump = require('pump');

class CReadable extends Readble {
  constructor (options) {
    super(options);
    this.count = 0;
  }
  _read() {
    const result = this.push(this.count.toString());
  }
}

class CWriteble extends Writeble {
  constructor (options) {
    super(options);
    this.count = 0;
  }
  _write(chunk, encoding, callback) {
    console.log = (chunk) => {
      process.stdout.write(`${chunk}\n`);
    };
  }
}

class CTransform extends Transform {
  constructor (options) {
    super(options);
  }
  _transform(chunk, encoding, callback) {
    const hashUpd = hash.update(chunk);
    setInterval((hashUpd) => this.push(hashUpd), 1000);
    callback();
  }
}

const tfStream = new CTransform();
const readStream = new CReadable();
const writeStream = new CWriteble();

pump(readStream, tfStream, writeStream, (e) => console.error(e));


