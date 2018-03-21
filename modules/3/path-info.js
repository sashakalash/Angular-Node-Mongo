const fs = require('fs');
const conf = {encoding: 'utf8'};

function pathInfo (path, callback) {
  const info = {path};
  fs.stat(path, getFileType);
  function getFileType(err, stat) {
    if (err) error = err;
    if (stat.isFile()) {
      info.type = 'file';
      readFile(path);
    }
    if (stat.isDirectory()) {
      info.type = 'directory';
      readDir(path);
    }
    function readFile(path) {
      fs.readFile(path, conf, (err, content) => {
        info.content = content;
        callback(err, info);
      });
    }
    function readDir(path) {
      fs.readdir(path, (err, files) => {
        info.childs = files;
        callback(err, info);
      });
    }
  }
}
module.exports = pathInfo;
