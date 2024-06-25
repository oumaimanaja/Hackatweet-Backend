const mongoose = require("mongoose");
const tweetsSchema = mongoose.Schema({
  text: String,
  hashtags: [{ type: String }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  CreateDate: { type: Date, default: Date.now },
});

const Tweet = mongoose.model("tweets", tweetsSchema);
module.exports = Tweet;
