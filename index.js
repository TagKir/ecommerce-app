const express = require("express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const users = require("./api/users");
const orders = require("./api/orders");
const products = require("./api/products");
const carts = require("./api/carts");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

var swaggerDefinition = {
  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger",
  },
  host: "localhost:3000",
  basePath: "/",
};

var options = {
  swaggerDefinition: swaggerDefinition,

  apis: ["./api/*.js"],
};

var swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", users);
app.use("/orders", orders);
app.use("/products", products);
app.use("/carts", carts);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
