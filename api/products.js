const express = require("express");
const db_products = require("../db/db_products");
const { resultsSend, errorSend } = require("../soft/soft");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.query.category) {
    db_products
      .getProductsByCategory(req.query.category)
      .then(resultsSend(res), errorSend(res));
  } else {
    db_products.getProducts().then(resultsSend(res), errorSend(res));
  }
});
router.get("/:productId", (req, res) => {
  db_products
    .getProductById(req.params.productId)
    .then(resultsSend(res), errorSend(res));
});

router.post("/addProduct", (req, res) => {
  db_products
    .addProduct(req.body)
    .then(
      (results) => res.status(201).send(`Product added with ID: ${results.id}`),
      errorSend(res)
    );
});

module.exports = router;
