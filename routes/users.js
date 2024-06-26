var express = require("express");
var router = express.Router();
const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");
const Tweet = require("../models/tweets");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

// POST  SIGN UP
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      //Create a token for a new user
      //Hash password
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((data) => {
        res.json({ result: true, userid: data._id, token: newUser.token, tweetsNumber: 0 });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// POST  SIGN IN
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({
    username: req.body.username,
    //password: req.body.password, password is hashed now
  }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      //res.json({ result: true, userid: data._id, token: data.token, data.tweets.length() });
      console.log(' user info : ', data )
      res.json({ result: true, userid: data._id, token: data.token, tweetsNumber: data.tweets.length });
    } else if (!data) {
      res.json({ result: false, error: "User not found" });
    } else if (!bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: false, error: "Incorrect password" });
    }
  });
});
