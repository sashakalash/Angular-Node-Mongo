const fs = require('fs');
const path = require('path'); 
const conf = {encoding: 'utf8'};

const readDir = pathToDir => {
  return new Promise((done, fail) => {
    fs.readdir(pathToDir, (err, fileArr) => {
      err? fail(err): done(fileArr);
    });
  });
};

const readFile = name => {
  return new Promise((done, fail) => {
    fs.readFile(name, conf, (err, content) => {
      err? fail(err): done({name, content});
    });
  });
};

const readAll = pathToDir => {
  return readDir(pathToDir)
      .then(files => files.map(file => readFile(path.join(pathToDir, file))))
      .then(filesArr => Promise.all(filesArr))
      .catch(err => fail(err));
};

module.exports = readAll;
