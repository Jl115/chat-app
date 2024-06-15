const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../models/index.js");
const initializeSocketServer = require("./sockets/socket");

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
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Initialize and use API routes
app.use("/api", routes(express.Router()));

// Test connection for Database
db.sequelize
  .authenticate()
  .then(() =>
    console.log("Database connection has been established successfully.")
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

// Create HTTP server
const server = require("http").createServer(app);

// Initialize Socket.IO server on the same port
initializeSocketServer(server);

// Start server
const PORT = process.env.SERVER_PORT || 9090;
server.listen(PORT, () => {
  try {
    console.log(`App listening at https://localhost:${PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
