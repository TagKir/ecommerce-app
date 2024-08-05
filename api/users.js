const express = require("express");
const db = require("../db/db");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
const session = require("express-session");

const router = express.Router();

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.query3(
      "SELECT * FROM users WHERE email = ?",
      [username],
      function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            if (
              !crypto.timingSafeEqual(
                Buffer.from(user.hashed_password, "hex"),
                hashedPassword
              )
            ) {
              return cb(null, false, {
                message: "Incorrect email or password.",
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

passport.deserializeUser(function (id, done) {
  db.query3("SELECT * FROM users WHERE id = ?", [id], function (err, user) {
    done(err, user);
  });
});

router.use(
  session({ secret: "PopitaSwish9", resave: false, saveUninitialized: true })
);
router.use(passport.initialize());

router.get("/", (req, res) => {
  db.query2("SELECT * FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
});

router.post("/register", (req, res) => {
  const { email, password, full_name } = req.body;
  const salt = crypto.randomBytes(16).toString("hex");
  crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.query3(
      "INSERT INTO users(email, hashed_password, salt, full_name, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, hashedPassword.toString("hex"), salt, full_name, new Date()],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res
          .status(201)
          .json({ message: `User added with ID: ${results.rows[0].id}` });
      }
    );
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: "Failure" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Successful authentication
      return res.status(200).json({ message: "Nice", user });
    });
  })(req, res, next);
});

module.exports = router;
