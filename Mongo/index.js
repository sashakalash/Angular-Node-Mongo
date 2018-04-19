const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/users';

const addUser = (collection, args) => {
  collection.insert({name:args[3], gender:args[4], age:args[5]}, (err, result) => {
    console.log(err? err: `User ${args[3]} added`); 
  });
};

const showUsers = (collection) => {
  collection.find().toArray((err, result) => {
    console.log(err? err: result);
  });
};

const updateUsers = (collection, args) => {
  collection.update({name:args[3]}, {'$set':{name:args[4]}}, {multi:true});
  console.log('Change saved');
};

const showUpd = (collection, user) => {
  collection.find({name:user}).toArray((err, res) => {
    console.log(err? err: res);
  });
};

const deleteUser = (collection, user) => {
  collection.remove({name:user});
  console.log(`User ${user} removed`);
};



MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(`Couldn't connect to Mongo's server. Err: ${err}`);
  }
  const collection = db.collection('users');
  const args = process.argv;
  switch (args[2]) {
    case 'add':
      addUser(collection, args);
      break;
    case 'showDB':
      showUsers(collection);
      break;
    case 'upd':
      updateUsers(collection, args);
      break;
    case 'showUpd':
      showUpd(collection, args[3]);
      break;
    case 'delete':
      deleteUser(collection, args[3]);
      break;
    default:
      console.log('Unknown command');
      break;
  }
});