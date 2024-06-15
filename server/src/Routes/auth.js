// Resolver
const {
  registerValidator,
  loginValidator,
  updateValidator,
} = require("../validators/authValidator");
// Controller
const {
  createUserController,
  checkUserController,
  updateUserController,
} = require("../controller/authController");
require("dotenv").config();

/**
 * The authRoutes function defines routes for login, profile, and logout with redirection based on authentication status.
 * @param {Object} router - The Express router instance.
 */
const authRoutes = (router) => {
  // Login route
  router.post("/login", async (req, res) => {
    const validationObject = loginValidator(req.body);
    if (validationObject.status === "400") {
      return res.send(validationObject);
    }
    const checkUser = await checkUserController(validationObject);
    if (checkUser.status === "400") {
      return res.send(checkUser);
    }
    return res.send(checkUser);
  });

  // Register route
  router.post("/register", async (req, res) => {
    const validationObject = registerValidator(req.body);

    if (validationObject.status === "400") {
      return res.send(validationObject);
    }
    const creation = await createUserController(validationObject);
    if (creation.status === "400") {
      return res.send(creation);
    }
    return res.send(creation);
  });

  router.post("/update", async (req, res) => {
    const token = req.headers.authorizationtoken;
    const validationObject = updateValidator(req.body);
    if (validationObject.status === "400") {
      return res.send(validationObject);
    }
    const update = await updateUserController(validationObject, token);
    if (update.status === "400") {
      return res.send(update);
    }
    return res.send(update);
  });

  router.get("/logout", (req, res) => {
    res.send("logout");
  });

  return router;
};

module.exports = authRoutes;
