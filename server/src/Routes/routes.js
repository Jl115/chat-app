const express = require("express");
const authRoutes = require("./auth.js"); // Ensure the correct path
const chatRoutes = require("./chat.js"); // Ensure the correct path
const aiRoutes = require("./ai.js"); // Ensure the correct path

/**
 * The function `routes` defines different routes for authentication, chat, and AI functionalities.
 * @param {Object} router - The Express router instance.
 */
const routes = (router) => {
  // Define the auth routes
  router.use("/auth", authRoutes(router));
  router.use("/chat", chatRoutes(router));
  router.use("/ai", aiRoutes(router));

  return router; // Return the router instance
};

module.exports = routes;
