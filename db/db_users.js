const db = require("../db/db");

// GET
function getUsers() {
  return new Promise((resolve, reject) => {
    db.query2("SELECT * FROM users", (error, results) => {
      if (error) {
        throw error;
      }
      resolve(results.rows);
    });
  });
}
function getUserById(req) {
  return new Promise((resolve, reject) => {
    db.query3(
      "SELECT * FROM users WHERE id = $1",
      [req.params.userId],
      (error, results) => {
        if (error) {
          throw error;
        } else if (Object.keys(results.rows).length === 0) {
          reject(new Error(`No users with id ${req.params.userId}`));
        }
        resolve(results.rows[0]);
      }
    );
  });
}

// POST
function registerUser(req) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO users(username, password, full_name, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.body.username, req.body.password, req.body.full_name, new Date()],
      (error, results) => {
        if (error) {
          throw error;
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
          reject(new Error("No rows returned"));
        }
        resolve(results.rows[0]);
      }
    );
  });
}

//PUT
function updateUser(req) {
  return new Promise((resolve, reject) => {
    db.query3(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3",
      [req.body.username, req.body.password, req.params.userId],
      (error, results) => {
        if (error) {
          throw error;
        }
        getUserById(req).then(
          (results) => resolve(),
          (error) => reject(new Error(error.message))
        );
      }
    );
  });
}

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
};
