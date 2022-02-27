const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatMessage } = require('./utils/messages');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRooms,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { rooms: getRooms() });
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

const botName = '🧙‍♂️';

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message_bot', {
      username: botName,
      text: 'Welcome to Naif chat 😎!',
      type: 'bot',
    });

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message_bot',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

  // when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message_bot', {
        username: botName,
        text: `${user.username} has left the chat`,
        type: 'bot',
      });

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
