const express = require("express");
const db = require("../db/db");
const db_users = require("../db/db_users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { resultsSend, errorSend } = require("../soft/soft");

const store = new session.MemoryStore();
const router = express.Router();

router.use(
  session({
    secret: "aljhalskfweio",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  const id = user.id;
  db.query3("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results.rows[0]);
  });
}); //! УБРАТЬ

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.query3(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (err, results) => {
        const user = results.rows[0];
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.password != password) {
          return cb(null, false);
        }
        return cb(null, user);
      }
    );
  })
);

router.get("/", (req, res) => {
  db_users.getUsers().then(resultsSend(res), errorSend(res));
});
router.get("/:userId", (req, res) => {
  db_users
    .getUserById(req.params.userId)
    .then(resultsSend(res), errorSend(res));
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(
    `Hello ${req.user.full_name}. You are now logged as ${req.user.username}`
  );
});
router.post("/register", (req, res) => {
  db_users
    .registerUser(req.body)
    .then(
      (results) => res.status(201).send(`User added with ID: ${results.id}`),
      errorSend(res)
    );
});

router.put("/:userId", (req, res) => {
  db_users
    .updateUser(req.body, req.params.userId)
    .then(
      (results) =>
        res.status(200).send(`User modified with ID: ${req.params.userId}`),
      errorSend(res)
    );
});

module.exports = router;
