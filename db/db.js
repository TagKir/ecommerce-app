const Pool = require("pg").Pool;
const pool = new Pool({
  user: "kaybyshevtagir",
  host: "localhost",
  database: "kaybyshevtagir",
  password: "PopitaSwish9",
  port: 5432,
});

module.exports = {
  query2: (text, func) => pool.query(text, func),
  query3: (text, params, func) => pool.query(text, params, func),
};
