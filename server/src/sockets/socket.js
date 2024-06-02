const { Server } = require("socket.io");
const { onConnection } = require("./controller/socketController");

const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => onConnection(socket));

  return io;
};

module.exports = initializeSocketServer;
