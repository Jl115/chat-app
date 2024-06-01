const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const path = require("path");
const db = require("../models/index.js");
const initializeWebsocketServer = require("./sockets/socket.js");

// Set path to .env file
require("dotenv").config();

const routes = require("./routes/routes.js");

// Initialize app
const app = express();
const corsOptions = {
  origin: "*",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, "../dist")));

// Route for serving the index.html

// WebSocket server
const websocketServer = new WebSocket.Server({ port: 9093 });
initializeWebsocketServer(websocketServer);
// send the static website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
// Initialize and use API routes
app.use("/api", routes(express.Router()));

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
