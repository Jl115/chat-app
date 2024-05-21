const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");

const authRoutes = require("./auth.routes.js");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// define the auth routes
router.use("/auth", authRoutes);
// define the about route
router.get("/about", function (req, res) {
  res.send("About birds");
});

module.exports = router;
