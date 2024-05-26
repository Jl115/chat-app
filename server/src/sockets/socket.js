const WebSocket = require("ws");
const message = require("../../models/message");

const clients = [];

/**
 * Initializes the websocket server.
 * @param {Object} server - The http server object.
 */
const initializeWebsocketServer = (websocketServer) => {
  websocketServer.on("connection", onConnection);
};

/**
 * Handles a new websocket connection.
 * @param {Object} ws - The websocket object.
 */
const onConnection = (ws) => {
  console.log("New websocket connection");
  ws.on("message", (message) => onMessage(ws, message));
  ws.on("close", () => onDisconnect(ws));
};

/**
 * Handles a new message from a websocket connection.
 * @param {Object} ws - The websocket object.
 * @param {Buffer} messageBuffer - The message buffer.
 */
const onMessage = (ws, messageBuffer) => {
  const messageString = messageBuffer.toString();
  console.log("Received message: " + messageString);

  try {
    const message = JSON.stringify(messageString);
    console.log("\x1b[33m%s\x1b[0m", "message --------------------", message);

    clients.push({ ws, message: message });
    // broadcastUsers();
    broadcastMessage(ws, messageString);

    // switch (message.type) {
    //   case "user":
    //     break;

    //   case "message":
    //     break;

    //   default:
    //     console.log("Unknown message type: " + message.type);
    // }
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
};

/**
 * Broadcasts the list of users to all clients.
 */
const broadcastUsers = () => {
  const usersMessage = {
    type: "users",
    users: clients.map((client) => client.user),
  };
  const usersMessageString = JSON.stringify(usersMessage);
  clients.forEach((client) => {
    client.ws.send(usersMessageString);
  });
};

/**
 * Broadcasts a message to all clients except the sender.
 * @param {Object} sender - The websocket object of the sender.
 * @param {string} messageString - The message string.
 */
const broadcastMessage = (sender, messageString) => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "sender --------------------",
    sender,
    messageString
  );
  clients.forEach((client) => {
    console.log("\x1b[33m%s\x1b[0m", "client --------------------", client);
    client.ws.send(messageString);
    /* if (client.ws !== sender) {
      console.log("\x1b[33m%s\x1b[0m", "send --------------------");
    } */
  });
};

/**
 * Handles a websocket disconnect.
 * @param {Object} ws - The websocket object.
 */
const onDisconnect = (ws) => {
  const index = clients.findIndex((client) => client.ws === ws);
  if (index !== -1) {
    clients.splice(index, 1);
    broadcastUsers();
  }
};

module.exports = initializeWebsocketServer;
