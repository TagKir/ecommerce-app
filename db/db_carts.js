const db = require("../db/db");

// GET
function getCartById(id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "SELECT * FROM carts_products WHERE cart_id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        } else if (Object.keys(results.rows).length === 0) {
          reject(new Error(`No cart with id ${id}`));
        }
        resolve(results.rows);
      }
    );
  });
}

// POST
function addProductToCart(cart_id, product_id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO carts_products(cart_id, product_id) VALUES ($1, $2) RETURNING *",
      [cart_id, product_id],
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
function addCart(user_id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO carts(user_id) VALUES ($1) RETURNING *",
      [user_id],
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
  getCartById,
  addProductToCart,
  addCart,
};
