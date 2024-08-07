var express = require("express");
const db_carts = require("../db/db_carts");
const { resultsSend, errorSend } = require("../soft/soft");

const router = express.Router();

router.get("/:cartId", (req, res) => {
  db_carts
    .getCartById(req.params.cartId)
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
    .addProductToCart(req.params.cartId, req.body.product_id)
    .then(
      (results) =>
        res.status(201).send(`Cart updated with ID: ${results.cart_id}`),
      errorSend(res)
    );
});

module.exports = router;
