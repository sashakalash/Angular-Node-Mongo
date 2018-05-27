
const serverCall = () => {
  return new Promise((done, fail) => {
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.get('/', (req, res) => {
      res.status(200);
      done();
    });
    app.listen(PORT);
  });
};

module.export = serverCall;


