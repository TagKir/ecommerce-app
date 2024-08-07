const db = require("../db/db");

// GET
function getOrders() {
  return new Promise((resolve) => {
    db.query2("SELECT * FROM orders", (error, results) => {
      if (error) {
        throw error;
      }
      resolve(results.rows);
    });
  });
}
function getOrderById(id) {
  return new Promise((resolve, reject) => {
    db.query3("SELECT * FROM orders WHERE id = $1", [id], (error, results) => {
      if (error) {
        throw error;
      } else if (Object.keys(results.rows).length === 0) {
        reject(new Error(`No order with id ${id}`));
      }
      resolve(results.rows[0]);
    });
  });
}

// POST
function addOrder(user_id, cart_id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO orders(user_id, cart_id, created_at) VALUES ($1, $2, $3) RETURNING *",
      [user_id, cart_id, new Date()],
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

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
};
