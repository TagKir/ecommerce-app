const db = require("../db/db");

// GET
const getUsers = (req, res) => {
  db.query2("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};
const getUserById = (req, res) => {
  db.query3(
    "SELECT * FROM users WHERE id = $1",
    [req.body.id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

// POST
const registerUser = (req, res) => {
  db.query3(
    "INSERT INTO users(username, password, full_name, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.body.username, req.body.password, req.body.full_name, new Date()],
    (error, results) => {
      if (error) {
        throw error;
      } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error;
      }
      res.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
};
