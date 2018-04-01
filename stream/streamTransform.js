const crypto = require('crypto');
const fs = require('fs');

const input = fs.createReadStream('data.txt');
const output = fs.createWriteStream('out_data_transform.txt');

const Transform = require('stream').Transform;

class CTransform extends Transform {
  constructor (type = 'md5') {
    super();
    this.hash = crypto.createHash(type);
    this.hashOutData = '';
  }
  _transform(chunk, encoding, callback) {
    this.hashOutData = this.hash.update(chunk);
    callback();
  }
  _flush(callback) {
    callback(null, this.push(this.hashOutData.digest('hex')));
    delete this.hash;
  }
}

const tf = new CTransform();

const hashOutData = input.pipe(tf);
hashOutData.pipe(output);
hashOutData.pipe(process.stdout);


