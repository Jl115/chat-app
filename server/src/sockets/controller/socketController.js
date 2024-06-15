const { createResponseController } = require("../../controller/aiController");
const { Message, User, Groups } = require("../../../models");
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
        broadcastUsers();
      }
    } catch (error) {
      console.error("Failed to verify token:", error);
    }
  });

  socket.on("message", (message) => onMessage(socket, message));
  socket.on("ki", (message) => onKi(socket, message));
  socket.on("disconnect", () => onDisconnect(socket));
  socket.on("fetchGroups", () => onGroupList(socket));
  socket.on("joinGroup", (group) => onJoinGroup(socket, group));
  socket.on("sendGroupMessage", (message) => onGroupMessage(socket, message));
  socket.on("fetchMessages", (token) => onFetchMessages(socket, token));
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

      broadcastMessage(socket, savedMessage);
    } else {
      console.error("User validation failed");
    }
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};

const onGroupList = async (socket, message) => {
  try {
    const groups = await Groups.findAll();
    socket.emit("groupList", groups);
  } catch (error) {
    console.error("Failed to fetch groups:", error);
  }
};

const onFetchMessages = async (socket, token) => {
  const tokenObj = JSON.parse(JSON.stringify(token));
  try {
    const decoded = jwt.verify(tokenObj, secretKey);
    const user = await User.findByPk(decoded.id);
    const allMessages = await Message.findAll();
    socket.emit("messageHistory", allMessages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }
};

const onJoinGroup = async (socket, group) => {
  let groupObj = JSON.parse(JSON.stringify(group));
  try {
    const decoded = jwt.verify(groupObj.token, secretKey);
    const user = await User.findByPk(decoded.id);
    if (
      user &&
      user.email === decoded.email &&
      user.username === decoded.username
    ) {
      user.groupId = groupObj.groupId;
      await user.save();

      // Update client with groupId
      const client = clients.find((client) => client.socket === socket);
      if (client) {
        client.groupId = groupObj.groupId;
      }

      const groupData = await Groups.findByPk(groupObj.groupId);
      socket.emit("group", groupData);
    } else {
      socket.emit("removeSession");
    }
  } catch (error) {
    console.error("Failed to join group:", error);
  }
};

const onGroupMessage = async (socket, message) => {
  const unbindedMessage = JSON.parse(JSON.stringify(message));

  try {
    const decoded = jwt.verify(unbindedMessage.token, secretKey);
    const user = await User.findByPk(decoded.id);
    if (
      user &&
      user.email === decoded.email &&
      user.username === decoded.username
    ) {
      const savedMessage = await Message.create({
        content: unbindedMessage.body,
        userId: user.id,
        groupId: unbindedMessage.groupId,
      });

      // Broadcast the message to all group members
      broadcastMessageToAllGroupMembers(
        socket,
        savedMessage,
        unbindedMessage.groupId
      );
    } else {
      console.error("User validation failed");
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
      broadcastMessageToAll(socket, savedMessage.content);
    } else {
      console.error("Failed to parse message:", error);
    }
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};

const broadcastUsers = () => {
  const usersMessage = clients
    .filter((client) => client.user)
    .map((client) => ({
      id: client.user.id,
      username: client.user.username,
    }));

  clients.forEach((client) => {
    client.socket.emit("users", usersMessage);
  });
};

const broadcastMessageToAllGroupMembers = (sender, message, groupId) => {
  clients.forEach((client) => {
    if (client.groupId === groupId && client.socket !== sender) {
      client.socket.emit("receiveGroupMessage", message);
    }
  });
  sender.emit("ownGroupMessage", message);
};

const broadcastMessage = (sender, message) => {
  clients.forEach((client) => {
    if (client.socket !== sender) {
      client.socket.emit("message", message.content);
    }
  });
  sender.emit("ownMessage", message.content);
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
