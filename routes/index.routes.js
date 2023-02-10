const router = require("express").Router();
User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// GET route ==> to display the index page to users
router.get("/", (req, res, next) => {
  res.render("index", { theme: "transparent" });
});

module.exports = router;
