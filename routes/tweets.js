var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");

const { checkBody } = require("../modules/checkBody");
const { checkTextLength } = require("../modules/checkTextLength");

//Function to extract hashtags from text
const extractHashtags = (text) => {
  const words = text.split(" "); // Split text into words

  // Array to store hashtags
  const hashtags = [];

  // Iterate through words to find hashtags
  words.forEach((word) => {
    // Check if word starts with '#'
    if (word.startsWith("#")) {
      // Remove '#' symbol and push to hashtags array
      const hashtag = word.slice(1); // Remove '#'
      hashtags.push(hashtag);
    }
  });

  return hashtags;
};

// Function to update Hashtag collection
const updateHashtags = async (hashtags, tweetId) => {
  for (const tag of hashtags) {
    try {
      // Find or create the hashtag
      let existingHashtag = await Hashtag.findOne({ hashtag: tag });

      if (!existingHashtag) {
        // If hashtag doesn't exist, create it
        existingHashtag = new Hashtag({ hashtag: tag, tweets: [] });
      }

      // Add tweet to the hashtag's tweets array
      existingHashtag.tweets.push(tweetId);
      await existingHashtag.save();
    } catch (err) {
      console.error(`Error updating hashtag ${tag}:`, err);
    }
  }
};
// POST / CreateTweet
router.post("/createTweet", async (req, res) => {
  //Check text is not empty
  if (!checkBody(req.body, ["text"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if text <100 characters
  if (!checkTextLength(req.body, ["text"])) {
    res.json({
      result: false,
      error: "The text must not exceed 100 characters",
    });
    return;
  }
  const { text, userId } = req.body;

  // Extract hashtags from the text
  const hashtags = extractHashtags(text);
  console.log(hashtags);
  // Create the tweet
  const newTweet = new Tweet({
    text,
    hashtags: hashtags,
    LikedBy: [],
    userId: userId,
  });
  console.log(newTweet);
  // Save the tweet to database
  const savedTweet = await newTweet.save();

  // Update hashtags collection if needed
  await updateHashtags(hashtags, savedTweet._id);
  // Update user's tweets array directly using user found by username
  await User.updateOne({ _id: userId }, { $push: { tweets: savedTweet._id } });
  return res.json({ result: true });
});

// GET List Tweets
// Route pour récupérer tous les tweets
router.get("/all", async (req, res) => {
  const tweets = await Tweet.find()
    .populate("likedBy", "username")
    .populate("userId", "username firstname"); // Optionnel : inclure les utilisateurs qui ont aimé le tweet, avec seulement le champ 'username'
  res.json(tweets);
});

// Delete Supprimer Tweet
router.delete("/delete/:id", async (req, res) => {
  const tweetId = req.params.id;
  await Tweet.deleteOne({ _id: tweetId });
  //mise à jour des autres collections :
  await User.updateMany({}, { $pull: { tweets: tweetId } }, { multi: true });
  await Hashtag.updateMany({}, { $pull: { tweets: tweetId } }, { multi: true });
  res.json({ message: "Tweet successfully deleted", result: true });
});

// POST LikeTweet
router.put("/like", async (req, res) => {
  const { tweetId, userId, isLiked } = req.body;

  if (isLiked === "true") {
    const a = await Tweet.updateOne(
      { _id: tweetId },
      { $push: { likedBy: userId } }
    );
  } else if (isLiked === "false") {
    await Tweet.updateOne({ _id: tweetId }, { $pull: { likedBy: userId } });
  }
  res.json({ result: true });
});
module.exports = router;
