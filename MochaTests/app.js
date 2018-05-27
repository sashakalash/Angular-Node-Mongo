const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(err,req, res, next) {
  if(err){console.log(err)};
  next();
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json('Wellcome to My Server!\n Please follow me!');
  res.sendStatus(200);
});

app.post('/add', (req, res) => {
  res.status(200).json(req.body.userId);
});

app.get('/delete/:userId', (req, res) => {
  res.status(200).json(`${req.params.userId} have deleted`);
});


module.exports = () => {
  return new Promise((done, fail) => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
      done();
    });
  });
};



