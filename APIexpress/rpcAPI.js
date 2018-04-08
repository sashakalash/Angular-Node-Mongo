const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./users').users;

app.use(bodyParser.json());
/*
req => {"jsonrpc": 2.0, "method": "createMem", "params": {"name": "Anton","score": "5858","id": "7"}, "id": 2}
res => {"jsonrpc":2,"result":"Member Anton created","id":2}
*/
const createMem = (params) => {
  users.push(params);
  return `Member id#${params.id} created`;
};
/*
req => {"jsonrpc": 2.0, "method": "showMem", "params": 6, "id": 3}
res => {"jsonrpc":2,"result":"{\"name\":\"Philipp\",\"score\":\"5858\",\"id\":\"6\"}","id":3}
*/
const showMem = (id) => {
  const user = users.find(u => u.id == id);
  return user? user: null;   
};
/*
req => {"jsonrpc": 2.0, "method": "changeMem", "params": { "name": "Andrea", "id": 6 }, "id": 3}
res => {"jsonrpc":2,"result":"Member has been changed","id":3}
*/
const changeMem = (param) => {
  let result = null;
  users.find(u => {
    if (u.id == param.id) {
      u = Object.assign(u, param);
      result = `Member id#${param.id} has been changed`;
    }
  });
  return result;
};
/*
req => {"jsonrpc": 2.0, "method": "deleteMem", "params": 6, "id": 3}
res => {"jsonrpc":2,"result":"Member 6 has been deleted","id":3}
*/
const deleteMem = (id) => {
  let result;
  users.find(u => {
    if (u.id == id) {
      u = null;
      result = `Member id#${id} has been deleted`;
    }
  });
  return result;
};

app.post('/api/rpc/', (req, res) => {
  switch (req.body.method) {

    case 'createMem':
      res.json({
        'jsonrpc': 2.0, 
        'result': `${createMem(req.body.params)}`, 
        'id': req.body.id
      });
    break;

    case 'showMem':
      const result = showMem(req.body.params);
      if (result) {
        res.json({
          'jsonrpc': 2.0, 
          'result': result, 
          'id': req.body.id
        }); 
      } else {
        res.status(404);
        res.send('Member not found');
      }
    break;

    case 'changeMem':
      const result2 = changeMem(req.body.params);
      if (result2) {
        res.json({
          'jsonrpc': 2.0, 
          'result': `${result2}`, 
          'id': req.body.id
        });
      } else {
        res.status(404);
        res.send('Member not found');
      }     
    break;

    case 'deleteMem':
      const result3 = deleteMem(req.body.params);
      if (result3) {
        res.json({
          'jsonrpc': 2.0, 
          'result': `${result3}`, 
          'id': req.body.id
        });
      } else {
        res.status(404);
        res.send('Member not found');
      } 
    break;

    default:
      res.status(404);
      res.send('Incorrect request');
    break;
  }
});

app.listen(3000, () => console.log('App started on 3000 port'));