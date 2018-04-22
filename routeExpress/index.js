const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));

const ctlrEmptyReq = (req, res) => {
  res.status(200);
  res.send('Hello, Express.js');
};

const ctlrHelloReq = (req, res) => {
  res.status(200);
  res.send('Hello stranger!');
};

const ctlrHelloNameReq = (req, res) => {
  res.status(200);
  res.send(`Hello ${req.params.name}!`);
};

const ctlrAnyReq = (req, res) => {
  res.status(200);
  res.send(`You requested URI: ${req.url}`);
};

const middleCheckHed = (req, res, next) => {
  if (!req.header('Key')) {
    req.auth = false;
  }
  next();
};

const ctrlPost = (req, res) => {
  if (!req.auth) {
    res.sendStatus(401);
    return;
  }
  if (Object.keys(req.body).length > 0) {
    res.json(req.body);
  } else {
    res.sendStatus(404);
  }    

};

app.get('/', ctlrEmptyReq);
app.get('/hello', ctlrHelloReq);
app.get('/hello/:name', ctlrHelloNameReq);
app.all('/sub/*', ctlrAnyReq);
app.post('/post', middleCheckHed, ctrlPost);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});