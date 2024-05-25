const router = require("express").Router();

require("dotenv").config();

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  res.send("chat ai");
});

router.post("/create", (req, res) => {
  res.send("create ai chat"); // redirect to /profile if authenticated
});

router.delete("/delete", (req, res) => {
  res.send("delete ai chat");
});

module.exports = router;
