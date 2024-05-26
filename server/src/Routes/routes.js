const express = require("express");
const router = express.Router();

const authRoutes = require("../routes/auth.js");
const chatRoutes = require("../routes/chat.js");
const aiRoutes = require("../routes/ai.js");

/**
 * The `routes` function sets up middleware to log the time of each request and defines different route groups for
 * authentication, chat, and AI functionalities.
 */
const routes = () => {
  // middleware that logs time every request
  router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now());
    next();
  });

  // define the auth routes
  router.use("/auth", authRoutes(router));
  router.use("/chat", chatRoutes(router));
  router.use("/ai", aiRoutes(router));
};
module.exports = routes;
