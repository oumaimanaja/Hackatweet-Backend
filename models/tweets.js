const mongoose = require("mongoose");
const tweetsSchema = mongoose.Schema({
  text: String,
  hashtag: [{ type: mongoose.Schema.Types.ObjectId, ref: "hashtags" }],
  LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetsSchema);
