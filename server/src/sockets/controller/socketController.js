const { createResponseController } = require("../../controller/aiController");
const { Message, User } = require("../../../models");
const jwt = require("jsonwebtoken");
const clients = [];

const secretKey = process.env.JWT_SECRET || "secret key";

const onConnection = (socket) => {
  console.log("New websocket connection");
  // Chat
  socket.on("message", (message) => onMessage(socket, message));
  // KI
  socket.on("ki", (message) => onKi(socket, message));
  // Disconnect
  socket.on("disconnect", () => onDisconnect(socket));
};

const onMessage = async (socket, message) => {
  const unbindedMessage = JSON.stringify(message);
  console.log(`Received message: ${unbindedMessage}`);

  try {
    const decoded = jwt.verify(message.token, secretKey);
    const user = await User.findByPk(decoded.id);

    if (
      user &&
      user.email === decoded.email &&
      user.username === decoded.username
    ) {
      const savedMessage = await Message.create({
        content: message.body,
        userId: user.id,
      });
      clients.push({ socket, message: savedMessage.content });
      broadcastMessage(socket, savedMessage);
    } else {
      throw new Error("User validation failed");
    }
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};

const onKi = async (socket, message) => {
  try {
    const requestObject = { message: message.body };

    const response = await createResponseController(requestObject);
    const decoded = jwt.verify(message.token, secretKey);
    const user = await User.findByPk(decoded.id);

    if (
      user &&
      user.email === decoded.email &&
      user.username === decoded.username
    ) {
      const savedMessage = await Message.create({
        content: response.message.content,
        userId: user.id,
      });
      clients.push({ socket, message: savedMessage.content });
      broadcastMessageToAll(socket, savedMessage.content);
    } else {
      throw new Error("User validation failed");
    }
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
  clients.forEach((client) => {
    if (client.socket !== sender)
      client.socket.emit("message", message.content);
    else if (client.socket === sender)
      client.socket.emit("ownMessage", message.content);
  });
};

const broadcastMessageToAll = (sender, messageString) => {
  clients.forEach((client) => {
    client.socket.emit("message", messageString);
  });
};

const onDisconnect = (socket) => {
  console.log("Disconnect");
  const index = clients.findIndex((client) => client.socket === socket);
  if (index !== -1) {
    clients.splice(index, 1);
    broadcastUsers();
  }
};

module.exports = { onConnection };
