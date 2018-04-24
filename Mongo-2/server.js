const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;



const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/contactBook';

const sendToBook = (collection, name, lastname, phone) => {
  return new Promise ((done, fail) => {
    collection.insert({
      name: name, 
      lastname: lastname, 
      phone: phone
    }, (err, res) => {
      err? fail(err): done(`${name} записан в записную книжку!`);
    });
  });
 };

const showAll = (collection) => {
  return new Promise((done, fail) => {
    collection.find().toArray((err, result) => {
      err? fail(err): done(result);
    });
  });
};

const findContact = (collection, data, type) => {
  return new Promise ((done, fail) => {
    collection.find({[type]: data}).toArray((err, result) => {
      err? fail(err): done(result);
    });
  });

};

const editContact = (collection, data) => {
  return new Promise((done, fail) => {
    collection.update(
      {_id: `ObjectId("${data.id}")`}, 
      {
        name: data.name, 
        lastname: data.lastname, 
        phone: data.phone
      }
    )
      .then(res => done(res))
      .catch(err => fail(err));
  });
};

const deleteContact = (collection, id) => {
  return new Promise((done, fail) => {
    collection.remove({_id: ObjectId("${id}")})
     .then(res => done(res))
     .catch(err => fail(err));
  });
};

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(`Couldn't connect to Mongo's server. Err: ${err}`);
  }
  const collection = db.collection('contactBook');

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.post('/', (req, res) => {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const phone = req.body.phone;
    sendToBook(collection, name, lastname, phone)
      .then(result => res.send(result))
      .catch(err => {
        res.status(404);
        res.send(err);
      });
    });

  app.get('/show', (req, res) => {
    showAll(collection)
      .then(result => res.send(result))
      .catch(err => {
        res.status(404);
        res.send(err);
      });
  });

  app.post('/find', (req, res) => {
    const data = req.body.data;
    const type = req.body.type;
    findContact(collection, data, type)
      .then(result => res.send(result))
      .catch(err => {
        res.status(404);
        res.send(err);
      });
  });

  app.post('/update', (req, res) => {
    editContact(collection, req.body)
      .then(result => res.send('Contact updated'))
      .catch(err => {
        console.log(err)
        res.status(404);
        res.send(err);
      });
  });

  app.post('/delete', (req, res) => {
    deleteContact(collection, req.body.id)
      .then(result => {
        console.log(result)
        res.send('Contact deleted')})
      .catch(err => {
        console.log(err)
        res.status(404);
        res.send(err);
      });
  });
  
});

app.listen(PORT, () => console.log(`App started on ${PORT} port`));