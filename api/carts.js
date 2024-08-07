const express = require("express");
const db_carts = require("../db/db_carts");
const db_orders = require("../db/db_orders");
const { resultsSend, errorSend } = require("../soft/soft");

const router = express.Router();

router.get("/:cartId", (req, res) => {
  db_carts
    .getCartProductsById(req.params.cartId)
    .then(resultsSend(res), errorSend(res));
});

router.post("/", (req, res) => {
  db_carts.addCart(req.body.user_id).then((results) => {
    db_carts
      .addProductToCart(results.id, req.body.product_id)
      .then(
        (results) =>
          res
            .status(201)
            .send(`Cart added and updated with ID: ${results.cart_id}`),
        errorSend(res)
      );
  }, errorSend(res));
});
router.post("/:cartId", (req, res) => {
  db_carts
    .cartCheckByIdAndProduct(req.params.cartId, req.body.product_id)
    .then((results) => {
      if (results.length == 0) {
        db_carts
          .addProductToCart(req.params.cartId, req.body.product_id)
          .then(
            (results) =>
              res.status(201).send(`Cart updated with ID: ${results.cart_id}`),
            errorSend(res)
          );
      } else {
        res.status(400).send("Dont repeat positions in cart");
      }
    });
});

// checkout
router.post("/:cartId/checkout", (req, res) => {
  db_carts
    .getUserByCardId(req.params.cartId)
    .then(
      (results) =>
        db_orders
          .addOrder(results, req.params.cartId)
          .then((results) =>
            res
              .status(201)
              .send(`CONGRATULATIONS, new order with id ${results.id}`)
          ),
      errorSend(res)
    );
});

module.exports = router;
