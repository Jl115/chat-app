const clients = [];

const onConnection = (socket) => {
  console.log("New websocket connection");
  socket.on("message", (message) => onMessage(socket, message));
  socket.on("disconnect", () => onDisconnect(socket));
};

const onMessage = (socket, message) => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "message --------------------",
    message.body
  );
  console.log("Received message: " + message);

  try {
    // const parsedMessage = JSON.parse(message.body);

    clients.push({ socket, message: message.body });
    broadcastMessage(socket, message);
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};

const broadcastUsers = () => {
  const usersMessage = {
    type: "users",
    users: clients.map((client) => client.user),
  };
  const usersMessageString = JSON.stringify(usersMessage);
  clients.forEach((client) => {
    client.socket.emit("message", usersMessageString);
  });
};

const broadcastMessage = (sender, messageString) => {
  clients.forEach((client) => {
    if (client.socket !== sender) client.socket.emit("message", messageString);
  });
};

const onDisconnect = (socket) => {
  console.log("\x1b[33m%s\x1b[0m", "disconect --------------------");
  const index = clients.findIndex((client) => client.socket === socket);
  if (index !== -1) {
    clients.splice(index, 1);
    broadcastUsers();
  }
};

module.exports = { onConnection };
