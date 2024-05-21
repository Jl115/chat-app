const router = require("express").Router();

require("dotenv").config();

// req.isAuthenticated is provided from the auth router
router.get("/login", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

router.get("/", (req, res) => {
  console.log("\x1b[33m%s\x1b[0m", "req --------------------", req);
  res.redirect("/profile"); // redirect to /profile if authenticated
});

router.get("/callback", (req, res) => {
  console.log("Callback Request:", req.query); // Log the request parameters
  console.log("Session Data:", req.session); // Log session data (if using sessions)
  res.redirect("/");
});

module.exports = router;
