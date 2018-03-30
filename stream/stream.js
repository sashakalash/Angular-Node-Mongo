const crypto = require('crypto');
const hash = crypto.createHash('md5');
const fs = require('fs');

const input = fs.createReadStream('data.txt');
const output = fs.createWriteStream('out_data.txt');

const hashOut = input.pipe(hash);
hashOut.pipe(output);
hashOut.pipe(process.stdout);


