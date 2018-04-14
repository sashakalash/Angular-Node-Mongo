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




io.on('connection', socket => {
  socket.on('added user', (nickname) => {
    if (nickname) return;
    cosket.nickname = nickname;
    numUsers++;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      nickname: nickname,
      numUsers: numUsers
    });
  });
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
