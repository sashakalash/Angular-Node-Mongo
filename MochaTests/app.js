const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const serverCall = () => {
  return new Promise((done, fail) => {
    app.listen(PORT, done());
  });
};
module.export = {f: serverCall};


