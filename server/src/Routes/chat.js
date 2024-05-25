const router = require("express").Router();

require("dotenv").config();

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  res.send("chat");
});

router.post("/edit/:id", (req, res) => {
  res.send("Profile"); // redirect to /profile if authenticated
});

router.delete("/delete/:id", (req, res) => {
  res.send("delete");
});

module.exports = router;
