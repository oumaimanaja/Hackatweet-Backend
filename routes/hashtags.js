var express = require("express");
var router = express.Router();

const Hashtag = require("../models/hashtags");

// GET List Hashtags
router.get("/all", async (req, res) => {
  const hashtags = await Hashtag.find();
  res.json(hashtags);
});

module.exports = router;

//  SearchByHashtag
router.get("/:tag", async (req, res) => {
  const hashtag = req.params.tag.slice(1);
  console.log("this is the:", hashtag);
  const tagresults = await Hashtag.find({ hashtag }).populate("tweets");
  res.json({ result: true, tagresults });
});
