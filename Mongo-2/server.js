const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;



const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/contact_book';



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  sendToBook();
  const collection = db.collection('users');
});



app.listen(PORT, () => console.log(`App started on ${PORT} port`));