const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
const port = 3000;

const users = require("./api/users");
const orders = require("./api/orders");
const products = require("./api/products");
const carts = require("./api/carts");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/users", users);
app.use("/orders", orders);
app.use("/products", products);
app.use("/carts", carts);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
