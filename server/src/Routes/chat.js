require("dotenv").config();
/**
 * The `chatRoutes` function defines routes for handling chat-related requests in a Node.js application.
 * @param router - The `router` parameter in the `chatRoutes` function is an instance of Express Router. It is used to
 * define routes for handling different HTTP methods like GET, POST, DELETE, etc. The routes defined using the `router`
 * object will be attached to the main Express application when the `chat
 */

const chatRoutes = (router) => {
  // req.isAuthenticated is provided from the auth router
  router.get("/chat", (req, res) => {
    res.send("chat");
  });

  router.post("/edit/:id", (req, res) => {
    res.send("Profile");
  });

  router.delete("/delete/:id", (req, res) => {
    res.send("delete");
  });
  return router;
};

module.exports = chatRoutes;
