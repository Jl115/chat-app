const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const db = require("../models/index.js");
const initializeWebsocketServer = require("./sockets/socket");

// Set path to .env file
require("dotenv").config();

const routes = require("./Routes/routes");

// Initialize app
const app = express();
/* app.use(auth(config)); */
var corsOptions = {
  // origin: "http://localhost:9091",
  origin: "*",
};

// mideleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// websocket server
const websocketServer = new WebSocket.Server({ port: 9093 });
initializeWebsocketServer(websocketServer);
//Routes
app.use("/", routes);
console.log(
  "\x1b[33m%s\x1b[0m",
  " ,process.env.DEV_DB_USERNAME--------------------",
  process.env.DB_USER
);

// Test connection for Database
db.sequelize
  .authenticate()
  .then(() =>
    console.log("Database connection has been established successfully.")
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

// Start server
app.listen(process.env.SERVER_PORT, () => {
  try {
    console.log(
      `App listening at https://localhost:${process.env.SERVER_PORT}`
    );
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
