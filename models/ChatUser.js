const users = [];

// Join user to chat
function ChatUser(id, username, chatID ) {
  const user = { id, username, chatID };

  users.push(user);

  return user;
}

module.exports = { ChatUser };