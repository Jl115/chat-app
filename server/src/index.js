const express = require("express");
const cors = require("cors");
const db = require("../models/index.js");

// Set path to .env file
require("dotenv").config();

const routes = require("./Routes/routes.js");

// Initialize app
const app = express();
var corsOptions = {
  origin: "http://localhost:9091",
};

// mideleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
