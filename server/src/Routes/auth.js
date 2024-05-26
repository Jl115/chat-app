require("dotenv").config();

/**
 * The authRoutes function defines routes for login, profile, and logout with redirection based on authentication status.
 * @param router - The `router` parameter in the `authRoutes` function is an instance of Express Router. It is used to
 * define routes for handling different HTTP requests like GET, POST, PUT, DELETE, etc. The routes defined using the
 * `router` object are then mounted in the main Express application using `
 */
const authRoutes = (router) => {
  // req.isAuthenticated is provided from the auth router
  router.get("/", (req, res) => {
    res.redirect("/auth/login");
  });
  router.get("/login", (req, res) => {
    res.send("login");
  });

  router.get("/profile", (req, res) => {
    res.send("Profile"); // redirect to /profile if authenticated
  });

  router.get("/logout", (req, res) => {
    res.send("logout");
  });
};

module.exports = authRoutes;
