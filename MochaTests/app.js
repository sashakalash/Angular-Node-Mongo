module.exports = () => {
  return new Promise((done, fail) => {
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(function(err,req, res, next) {
      if(err)console.log(err);
      next();
  });

    const PORT = process.env.PORT || 3000;

    app.get('/', (req, res) => {
      res.send('Wellcome to My Server!\n Please follow me!');
      res.status(200);
    });

    app.post('/add', (req, res) => {
      res.send(req.body.userId);
      res.status(200);
    });

    app.get('/delete/:userId', (req, res) => {
      res.send(`${req.params.userId} have deleted`)
      res.status(200);
    });

    app.listen(PORT, () => {
      done();
      console.log(`App listening on port ${PORT}!`);
    });
  });
};



