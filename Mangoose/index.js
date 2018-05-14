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

tasksScheme.methods.changeStatus = (id) => {
  return new Promise((done, fail) => {
    Task.findById(id, (err, res) => {
      if (err) {
        fail(err);
      }
      res.status = res.status? 'false': 'true';
      res.save((err, result) => err? fail(err): done());
    });
  });  
};

tasksScheme.methods.delegate = (taskId, userId) => {
  return new Promise((done, fail) => {
    Task.findById(taskId, (err, res) => {
      if (err) {
        fail(err);
      }
      res.user = new ObjectId(userId);
      res.save((err, result) => err? fail(err): done());
    });
  });  
};


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

app.post('/add/user', (req, res) => {
  const user = new User({name: req.body.name});
  mongoose.connect(url);
  user.save()
    .then(doc => {
      res.send(`Создан объект ${doc}`);
      mongoose.disconnect();  
    })
    .catch(err => {
      res.status(404);
      res.send(err);
      mongoose.disconnect();
    });
});

app.post('/add/task', (req, res) => {
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    user: req.body.id
  });
  answer = 'Создана задача';
  mongoose.connect(url);
  task.save()
    .then(doc => {
      res.send(`Создана задача ${doc}`);
      mongoose.disconnect();  
    })
    .catch(err => {
      res.status(404);
      res.send(err);
      mongoose.disconnect();
    });
});  

app.post('/edit/user', (req, res) => {
  mongoose.connect(url);
  const query = {_id: new ObjectId(req.body.id)};
  const toChange = {name: req.body.name};
  User.update(query, toChange, (err, result) => callbackDB(err, res, `Изменен объект ${req.body.name}`));
});

app.post('/edit/task', (req, res) => {
  mongoose.connect(url);
  const toChange = {$set: req.body.change};
  Task.update(query, toChange, (err, result) => callbackDB(err, res, `Изменена задача ${req.body.id}`));

});

app.post('/delete/user', (req, res) => {
  mongoose.connect(url);
  const query = {_id: new ObjectId(req.body.id)};
  User.remove(query, (err, result) => callbackDB(err, res, `Удален объект ${req.body.id}`));
});

app.post('/delete/user', (req, res) => {
  mongoose.connect(url);
  const query = {_id: new ObjectId(req.body.id)};
  Task.remove(query, (err, result) => callbackDB(err, res, `Удалена задача ${req.body.id}`));
});

app.get('/show/:reqType', (req, res) => {
  mongoose.connect(url);
  const obj = req.params.reqType === 'user'? User: Task;
  obj.find((err, result) => callbackDB(err, res, result));
});

app.post('/change_status', (req, res) => {
  mongoose.connect(url);
  new Task().changeStatus(req.body.id)
    .then(result => callbackDB(null, res, `Статус задачи ${req.body.id} изменен`))
    .catch(err => callbackDB(err, res));
});

app.post('/delegate', (req, res) => {
  mongoose.connect(url);
  new Task().delegate(req.body.taskId, req.body.userId)
    .then(result => callbackDB(null, res, `Задача ${req.body.taskId} делегирована на ${req.body.userId}`))
    .catch(err => callbackDB(err, res));
});

app.post('/find', (req, res) => {
  mongoose.connect(url);
  Task.find({$or : [{
    name: {$regex:req.body.name}},  
    {description: {$regex:req.body.description}}
  ]}, (err, result) => callbackDB(err, res, result));
});

app.listen(PORT, () => console.log(`App started on ${PORT} port`));

