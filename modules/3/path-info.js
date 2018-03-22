const fs = require('fs');
const conf = {encoding: 'utf8'};

function pathInfo (path, callback) {
  const info = {path};
  fs.stat(path, getFileType);
  
  function getFileType(err, stat) {
    if (err) {
      callback(err);
      return;
    }

    if (stat.isFile()) {
      info.type = 'file';
      readFile(path);
    }

    if (stat.isDirectory()) {
      info.type = 'directory';
      readDir(path);
    }

    function readFile(path) {
      if (err) {
        callback(err);
        return;
      }
      fs.readFile(path, conf, (err, content) => {
        info.content = content;
        callback(null, info);
      });
    }

    function readDir(path) {
      if (err) {
        callback(err);
        return;
      }
      fs.readdir(path, (err, files) => {
        info.childs = files;
        callback(null, info);
      });
    }
  }
}

module.exports = pathInfo;
