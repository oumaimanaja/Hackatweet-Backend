const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  username: { type: String, unique: true },
  password: String,
  token: String,
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
