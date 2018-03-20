const fs = require('fs');
const config = {encoding: 'utf8'};

exports.read = file => {
  return new Promise((done, fail) => {
    fs.readFile(file, config, (err, content) =>{
      err? fail(err): done(content);
    });
  });
};

exports.write = (file, data) => {
  return new Promise((done, fail) => {
    fs.writeFile(file, data, config, err => {
      err? fail(err): done(file);
    });
  });
};

