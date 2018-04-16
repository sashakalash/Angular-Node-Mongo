const loginPage = document.querySelector('.login.page');
      const login = document.querySelector('.login.page input');
      const loginForm = document.querySelector('.login.page form');
      const form = document.querySelector('.chat.page form');
      const input = document.querySelector('input');
      const messages = document.querySelector('#messages');
      const room1Btn = document.querySelector('.enter_room1');
      const room2Btn = document.querySelector('.enter_room2');
      

      const socket = io();

      const enterRoom = (e) => {
        const roomNumber = (e.target.classList.contains('enter_room1'))? 'room1': 'room2';
        console.log(roomNumber + ' client')
        socket.emit('create', roomNumber);
      };

      room1Btn.addEventListener('click', enterRoom);
      room2Btn.addEventListener('click', enterRoom);

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginPage.style.setProperty('--loginVis', 'hidden');
        socket.emit('added user', login.value);
      });

      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        socket.emit('chat message', input.value);
        input.value = null;
        return false;
      });

      const chatMess = (msg) => {
        const text = document.createElement('li');
        text.innerText = msg;
        messages.appendChild(text);
      };

      socket.on('chat message', msg => {
        chatMess(msg);
      });

      socket.on('login', data => {
        chatMess(`You've joined to ${data.room}\nThere are ${data.numUsers} users`);
      });

      socket.on('user joined', data => {
        chatMess(`${data.nickname} joined.\nThere are ${data.numUsers} users`);
      });