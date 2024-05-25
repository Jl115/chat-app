const express = require("express");
const router = express.Router();
// const { requiresAuth } = require("express-openid-connect");

const authRoutes = require("../routes/auth.js");
const chatRoutes = require("../routes/chat.js");
const aiRoutes = require("../routes/ai.js");
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
// router.get("/profile", requiresAuth(), (req, res) => {
//   console.log(
//     "\x1b[33m%s\x1b[0m",
//     "req.oidc.user --------------------",
//     req.oidc.user
//   );
//   res.send(JSON.stringify(req.oidc.user));
// });

// define the auth routes
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/ai", aiRoutes);
// define the about route
router.get("/about", function (req, res) {
  res.send("About birds");
});

module.exports = router;
