const db = require("../db/db");

// GET
function getProducts() {
  return new Promise((resolve, reject) => {
    db.query2("SELECT * FROM products", (error, results) => {
      if (error) {
        throw error;
      }
      resolve(results.rows);
    });
  });
}
function getProductById(id) {
  return new Promise((resolve, reject) => {
    db.query3(
      "SELECT * FROM products WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        } else if (Object.keys(results.rows).length === 0) {
          reject(new Error(`No product with id ${id}`));
        }
        resolve(results.rows[0]);
      }
    );
  });
}
function getProductsByCategory(category) {
  return new Promise((resolve, reject) => {
    db.query3(
      "SELECT * FROM products WHERE category = $1",
      [category],
      (error, results) => {
        if (error) {
          throw error;
        } else if (Object.keys(results.rows).length === 0) {
          reject(new Error(`No product with category ${category}`));
        }
        resolve(results.rows);
      }
    );
  });
}

// POST
function addProduct(body) {
  return new Promise((resolve, reject) => {
    db.query3(
      "INSERT INTO products(name, category, price, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [body.name, body.category, body.price, new Date()],
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
  getProducts,
  getProductById,
  getProductsByCategory,
  addProduct,
};
