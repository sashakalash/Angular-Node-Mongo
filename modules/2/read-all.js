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

const readFile = file => {
  return new Promise((done, fail) => {
    fs.readFile(file, conf, (err, content) => {
      err? fail(err): done({file, content});
    });
  });
};

const readAll = pathToDir => {
  return new Promise((done, fail) => {
    readDir(pathToDir)
      .then(files => files.map(file => readFile(path.join(pathToDir, file))))
      .then(filesArr => Promise.all(filesArr))
      .then(contentArr => done(contentArr.map(item => {
        return {name: item.file, content: item.content};
      })))
      .catch(err => fail(err));
    
  });
};
module.exports = readAll;
