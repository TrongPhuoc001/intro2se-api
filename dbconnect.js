const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "phuoc190301",
//     database: "eclass",
//     host: "localhost",
//     port: 5432
// });

module.exports = pool;