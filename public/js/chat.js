const el = ($el) => document.querySelector($el);

const chatForm = el('#chat-form');
const chatMessages = el('.chat-messages');
const roomName = el('#room-name');
const userList = el('#users');

const socket = io();

const getUrlParam = (param) => new URL(location).searchParams.get(param);

const username = getUrlParam('username');
const room = getUrlParam('room');

// Join chatroom
socket.emit('joinRoom', { username, room });

// Add users to DOM
const renderUsers = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
};

// Add room name to DOM
const renderRoomName = (outputRoom) => {
  roomName.innerText = outputRoom;
};

// Output message to DOM
const renderMessage = (message) => {
  const div = document.createElement('div');
  const isCurrentUsername = message.username === username;
  const messageClass = isCurrentUsername ? 'message-start' : 'message-end';

  div.classList.add('message');

  if (message.type !== 'bot') {
    div.classList.add(messageClass);
  }

  const html = `
    <p class="meta "> ${message.username} </p>
    <span> ${message.time} </span>
    <p class="text"> ${message.text} </p>
  `;

  div.innerHTML = html;
  document.querySelector('.chat-messages').appendChild(div);
};

// render bot message to DOM
const renderBotMessage = (message) => {
  const div = document.createElement('div');

  const html = `
    <div class="message_bot">
      <p class="meta"> ${message.username} </p>
      <p class="text"> ${message.text} </p>
    </div>
  `;

  div.innerHTML = html;
  document.querySelector('.chat-messages').appendChild(div);
};

// Get room and users
socket.on('roomUsers', ({ room: usersRoom, users }) => {
  renderRoomName(usersRoom);
  renderUsers(users);
});

// bot Message from server
socket.on('message_bot', (message) => {
  renderBotMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message from server
socket.on('message', (message) => {
  renderMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let message = e.target.elements.msg.value;
  if (message) {
    // Emit message to server
    message = message.trim();
    socket.emit('chatMessage', message);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  }
});

// Prompt the user before leave chat room

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '/';
  }
});
