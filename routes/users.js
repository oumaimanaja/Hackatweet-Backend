var express = require("express");
var router = express.Router();
const users = require("../models/users");
const tweets = require("../models/tweets");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
