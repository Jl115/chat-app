const { createResponseController } = require("../../controller/aiController");
const clients = [];

const onConnection = (socket) => {
  console.log("New websocket connection");
  // Chat
  socket.on("message", (message) => onMessage(socket, message));
  // Ki
  socket.on("ki", (message) => onKi(socket, message));
  // Disconnect
  socket.on("disconnect", () => onDisconnect(socket));
};

const onMessage = (socket, message) => {
  const unbindedMessage = JSON.stringify(message);
  console.log(`Received message: ${unbindedMessage}`);

  try {
    console.log(
      "\x1b[33m%s\x1b[0m",
      " message.body --------------------",
      message.body
    );
    clients.push({ socket, message: message.body });
    broadcastMessage(socket, message);
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};
const onKi = async (socket, message) => {
  try {
    const requestObject = { message: message.body };

    const response = await createResponseController(requestObject);
    console.log(
      "\x1b[33m%s\x1b[0m",
      "response.message.content --------------------",
      response.message.content
    );
    clients.push({ socket, message: response.message.content });
    broadcastMessageToAll(socket, response.message.content);
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

const broadcastMessage = (sender, message) => {
  console.log("\x1b[33m%s\x1b[0m", "message --------------------", message);
  clients.forEach((client) => {
    if (client.socket !== sender) client.socket.emit("message", message.body);
    else if (client.socket === sender)
      client.socket.emit("ownMessage", message.body);
  });
};
const broadcastMessageToAll = (sender, messageString) => {
  clients.forEach((client) => {
    client.socket.emit("message", messageString);
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
