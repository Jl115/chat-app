const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// Set path to .env file
dotenv.config({ path: "./.env" });
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
