const { createResponseController } = require("../../controller/aiController");
const { Message, User } = require("../../../models");
const jwt = require("jsonwebtoken");
const clients = [];

const secretKey = process.env.JWT_SECRET || "secret key";

const onConnection = (socket) => {
  console.log("New websocket connection");

  socket.on("join", async (obj) => {
    try {
      const verify = jwt.verify(obj.token, secretKey);
      const user = await User.findByPk(verify.id);

      if (user) {
        clients.push({ socket, user });
        console.log("\x1b[33m%s\x1b[0m", "user --------------------", user);
        broadcastUsers();
      }
    } catch (error) {
      console.error("Failed to verify token:", error);
    }
  });

  socket.on("message", (message) => onMessage(socket, message));
  socket.on("ki", (message) => onKi(socket, message));
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
  const usersMessage = clients.map((client) => ({
    id: client.user.id,
    username: client.user.username,
  }));

  clients.forEach((client) => {
    console.log("\x1b[33m%s\x1b[0m", "emit --------------------");
    client.socket.emit("users", usersMessage);
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
