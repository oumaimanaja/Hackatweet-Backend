var express = require("express");
var router = express.Router();

const hashtags = require("../models/hashtags");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

// GET SearchByHashtag
// GET List Hashtags
