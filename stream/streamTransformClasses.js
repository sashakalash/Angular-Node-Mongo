const crypto = require('crypto');
const hash = crypto.createHash('md5');

const Transform = require('stream').Transform;
const Readble = require('stream').Readable;
const Writeble = require('stream').Writable;
const pump = require('pump');

class CReadable extends Readble {
  constructor (options) {
    super(options);
  }
  _read() {
    const digit = Math.round(Math.random() * 9);
    this.push(digit.toString());
  }
}

class CWriteble extends Writeble {
  constructor (options = {objectMode: true}) {
    super(options);
  }
  _write(chunk, encoding, callback) {
    console.log(chunk);
    callback();
  }
}

class CTransform extends Transform {
  constructor (options = {objectMode: true}) {
    super(options);
  }
  _transform(chunk, encoding, callback) {
    const hashUpd = hash.update(chunk);
    setTimeout(() => {
      this.push(hash);
      callback();
    }, 1000);
  }
}

const tfStream = new CTransform();
const readStream = new CReadable();
const writeStream = new CWriteble();

pump(readStream, tfStream, writeStream, (e) => console.error(e));




