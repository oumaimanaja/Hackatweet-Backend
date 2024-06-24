var express = require("express");
var router = express.Router();
const tweets = require("../models/tweets");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

// POST / CreateTweet
// Delete Supprimer Tweet
// POST LikeTweet
// GET List Tweets
