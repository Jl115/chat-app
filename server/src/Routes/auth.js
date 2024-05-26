// Resolver
const { registerResolver } = require("../resolver/authResolver");
// Controller
const { createUserController } = require("../controller/authController");
require("dotenv").config();

/**
 * The authRoutes function defines routes for login, profile, and logout with redirection based on authentication status.
 * @param {Object} router - The Express router instance.
 */
const authRoutes = (router) => {
  router.get("/", (req, res) => {
    res.redirect("/auth/login");
  });

  router.get("/login", (req, res) => {
    res.send("login");
  });

  router.post("/register", async (req, res) => {
    const validationObject = registerResolver(req.body);

    if (validationObject.status === "400") {
      return res.send(validationObject);
    }
    const creation = await createUserController(validationObject);
    if (creation.status === "400") {
      return res.send(creation);
    }
    return res.send(creation);
  });

  router.get("/profile", (req, res) => {
    res.send("Profile");
  });

  router.get("/logout", (req, res) => {
    res.send("logout");
  });

  return router; // Return the router instance with routes defined
};

module.exports = authRoutes;
