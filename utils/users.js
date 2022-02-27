const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// Get current user
const getCurrentUser = (id) => users.find((user) => user.id === id);

// User leaves chat
const userLeave = (id) => {
  const userIndex = users.findIndex((item) => item.id === id);

  return users.splice(userIndex, 1);
};

// Get room users
const getRoomUsers = (room) => users.filter((user) => user.room === room);

// get rooms
const getRooms = () => {
  if (users.length > 0) {
    const ROOMS = new Set(users.map((user) => user.room));

    return [...ROOMS];
  }

  return [];
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getRooms,
};
