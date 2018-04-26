const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
 
const userScheme = new Schema({name: String});
const tasksScheme = new Schema({
  name: String, 
  descrition: String, 
  status: Boolean, 
  user: Schema.Types.ObjectId
});

const User = mongoose.model("User", userScheme);
const Task = mongoose.model("Tasks", tasksScheme);
const url = 'mongodb://localhost:27017/TaskList';

const callbackDB = (err, response, answer) => {
  if (err) {
    response.status(404);
    response.send(err);
    mongoose.disconnect();
  }
  response.send(answer);
  mongoose.disconnect(); 
};

app.post('/add/:reqType', (req, res) => {
  let newObj, answer; 
  if (req.params.reqType === 'user') {
    newObj = new User({name: req.body.name});
    answer = 'Создан объект';
  } else if (req.params.reqType === 'task') {
    newObj = new Task({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      user: req.body.id
    });
    answer = 'Создана задача';
  }

  mongoose.connect(url);
  newObj.save()
    .then(doc => {
      res.send(answer + ' ' + doc);
      mongoose.disconnect();  
    })
    .catch(err => {
      res.status(404);
      res.send(err);
      mongoose.disconnect();
    });
 
});

app.post('/edit/:reqType', (req, res) => {
  mongoose.connect(url);
  const query = {_id: new ObjectId(req.body.id)};
  let obj, objToChange, answer; 

  if (req.params.reqType === 'user') {
    obj = User;
    objToChange = {name: req.body.name};
    answer = `Изменен объект ${req.body.name}`;
  } else if (req.params.reqType === 'task') {
    obj = Task;
    //req => id: ObjectID, "change": {key: value}
    objToChange = {$set: req.body.change};
    answer = `Изменена задача ${req.body.id}`;
  }
console.log(objToChange)
  obj.update(query, objToChange, (err, result) => callbackDB(err, res, answer));
});


app.post('/delete/:reqType', (req, res) => {
  mongoose.connect(url);
  const query = {_id: new ObjectId(req.body.id)};
  let obj, answer; 

  if (req.params.reqType === 'user') {
    obj = User;
    answer = `Удален объект ${req.body.id}`;
  } else if (req.params.reqType === 'task') {
    obj = Task;
    answer = `Удалена задача ${req.body.id}`;
  }
  obj.remove(query, (err, result) => callbackDB(err, res, answer));
});

app.get('/show/:reqType', (req, res) => {
  mongoose.connect(url);
  const obj = req.params.reqType === 'user'? User: Task;
  obj.find((err, result) => callbackDB(err, res, result));
});

tasksScheme.statics.changeStatus = (id, cb) => {
  return this.findById(id, cb);
    
};

app.post('/change_status', (req, res) => {
  Task.changeStatus(req.body.id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result)
  });
    
});

app.listen(PORT, () => console.log(`App started on ${PORT} port`));

