const router = require("express").Router();

require("dotenv").config();

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

module.exports = router;
