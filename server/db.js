const { Pool } = require("pg"); // Correctly import the Pool class
require("dotenv").config(); // Ensure dotenv is correctly spelled and loaded

// Create a new instance of Pool
const pool = new Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
});

// Export the pool instance
module.exports = pool;
