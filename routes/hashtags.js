var express = require("express");
var router = express.Router();

const Hashtag = require("../models/hashtags");

// GET List Hashtags
router.get("/all", async (req, res) => {
  const hashtags = await Hashtag.find().sort({ tweets: -1 });
  res.json(hashtags);
});

module.exports = router;

//  SearchByHashtag
router.get("/:tag", async (req, res) => {
  const hashtag = req.params.tag.slice(1);
  console.log("this is the:", hashtag);
  const tagresults = await Hashtag.find({ hashtag }).populate("tweets");
  console.log("this is the:", tagresults);
  if (tagresults.length != 0) {
    res.json({
      result: true,
      Nbr: tagresults[0].tweets.length,
      tagresults,
    });
  } else if (tagresults.length === 0) {
    res.json({
      result: false,
      Nbr: 0,
      tagresults: [],
    });
  }
});
