const express = require("express");
const db = require("../db/db");
const db_users = require("../db/db_users");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const session = require("express-session");

const router = express.Router();

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.query3(
      "SELECT * FROM users WHERE username = $1",
      [username],
      function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            console.log("hello");
            if (err) {
              return cb(err);
            }
            if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, user);
          }
        );
      }
    );
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (user, done) {
  done(null, user.id);
});
router.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);

router.get("/", db_users.getUsers);
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/register", db_users.registerUser);
router.post(
  "/login/password",
  passport.authenticate("local"),
  function (req, res) {
    res.redirect("/~" + req.user.username);
  }
);

module.exports = router;
