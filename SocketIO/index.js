const express = require('express');
const app = express();
const http = require('http').Server(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

http.listen(3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(http);

let numUsers = 0;

io.on('connection', socket => {
  let addedUser = false;
   
  socket.on('create', (roomNumber) => {
    socket.broadcast.to(socket.room).emit('chat message', `${socket.nickname} has left ${socket.room}`);
    socket.leave(socket.room);
    socket.join(roomNumber);
    socket.to(roomNumber).emit('chat message', `You've  joined to ${roomNumber}`);
    socket.room = roomNumber;
  });
  
  socket.on('added user', (nickname) => {
    if (addedUser) return;
    socket.nickname = nickname;
    numUsers++;
    addedUser = true;
    socket.join('main');
    socket.room = 'main';
    socket.emit('login', {
      room: socket.room,
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      nickname: nickname,
      numUsers: numUsers
    });
  });

  socket.on('chat message', msg => {
    io.to(socket.room).emit('chat message', msg);
  });
});
