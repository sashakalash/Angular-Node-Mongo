const crypto = require('crypto');
const hash = crypto.createHash('md5');
const fs = require('fs');

const input = fs.createReadStream('data.txt');
const output = fs.createWriteStream('out_data.txt');

const hashTransform = crypto.createHash('md5');
const Transform = require('stream').Transform;

class CTransform extends Transform {
  constructor (data) {
    super();
    const enc = {encoding: 'hex'};
  }
  _transform(data, , ) {
    return this.hash.digest('hex');
  }
}

const tf = new CTransform();

input.pipe(hash);
hash.pipe(tf._transform);
hash.pipe(output);
/*от аспиранта узнал, что лучше сохранить в переменную результат pipe, а потом с ним работать. 
у меня работает и так, прошу объяснить, если является ошибкой*/
hash.pipe(process.stdout);


