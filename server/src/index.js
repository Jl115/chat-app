const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../models/index.js");
const initializeSocketServer = require("./sockets/socket");
const { Sequelize } = require("sequelize");

// Set path to .env file
require("dotenv").config();

const routes = require("./routes/routes.js");

// Initialize app
const app = express();
const corsOptions = {
  origin: "*",
};
console.log(
  "\x1b[33m%s\x1b[0m",
  "process.env.DB_PORT  --------------------",
  process.env.DB_PORT
);
// Test connection for Database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
sequelize
  .authenticate()
  .then(() =>
    console.log("Database connection has been established successfully.")
  )
  .catch((error) => console.error("Unable to connect to the database:", error));

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

// Create HTTP server
const server = require("http").createServer(app);

// Initialize Socket.IO server on the same port
initializeSocketServer(server);

// Start server
const PORT = process.env.SERVER_PORT || 80;
server.listen(PORT, () => {
  try {
    console.log(`App listening at https://localhost:${PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
