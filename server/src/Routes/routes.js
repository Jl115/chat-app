const authRoutes = require("./auth.js");
const chatRoutes = require("./chat.js");
const aiRoutes = require("./ai.js");

/**
 * The function `routes` defines different routes for authentication, chat, and AI functionalities.
 * @param {Object} router - The Express router instance.
 */
const routes = (router) => {
  // Define the auth routes
  router.use("/auth", authRoutes(router));
  router.use("/chat", chatRoutes(router));
  router.use("/ai", aiRoutes(router));

  return router;
};

module.exports = routes;
