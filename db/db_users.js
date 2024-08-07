const db = require("../db/db");

// GET
function getUsers() {
  return new Promise((resolve) => {
    db.query2("SELECT * FROM users", (error, results) => {
      if (error) {
        throw error;
      }
      resolve(results.rows);
    });
  });
}
function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.query3("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
      if (error) {
        throw error;
      } else if (Object.keys(results.rows).length === 0) {
        reject(new Error(`No users with id ${id}`));
      }
      resolve(results.rows[0]);
    });
  });
}

// POST
function registerUser(body) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO users(username, password, full_name, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [body.username, body.password, body.full_name, new Date()],
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
function updateUser(body, id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3",
      [body.username, body.password, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        getUserById(id).then(
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
