const crypto = require('crypto');
const hash = crypto.createHash('md5');
const fs = require('fs');

const input = fs.createReadStream('data.txt');
const output = fs.createWriteStream('out_data_transform.txt');

// const hashTransform = crypto.createHash('hex');
const Transform = require('stream').Transform;

class CTransform extends Transform {
  constructor (options) {
    super(options);
  }
  _transform(chunk, encoding, callback) {
    const hashUpd = hash.update(chunk);
    this.push(hashUpd.digest('hex'));
    callback();
  }
  _flush(doneCallback) {
    
  }
}

const tf = new CTransform();

const hashOut = input.pipe(tf);
hashOut.pipe(output);
hashOut.pipe(process.stdout);


