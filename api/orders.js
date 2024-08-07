const express = require("express");
const db_orders = require("../db/db_orders");
const { resultsSend, errorSend } = require("../soft/soft");

const router = express.Router();

router.get("/", (req, res) => {
  db_orders.getOrders().then(resultsSend(res));
});
router.get("/:orderId", (req, res) => {
  db_orders
    .getOrderById(req.params.orderId)
    .then(resultsSend(res), errorSend(res));
});

module.exports = router;
