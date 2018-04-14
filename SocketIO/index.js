const app = require('express')();
const http = require('http').Server(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(http);

let numUsers = 0;
let addedUser = false;
const addingUser = (nickname) => {
    if (addedUser) return;
    numUsers++;
    addedUser = true;
    io.emit('chat message', `There are ${numUsers} user(s)`);
    // io.broadcast.emit('chat message', `${nickname} joined.\nThere are ${numUsers} users`);
};

io.on('connection', socket => {
  socket.on('added user', (nickname) => {
    addingUser(nickname);
  });
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
