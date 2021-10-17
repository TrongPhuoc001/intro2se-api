//heroku database
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized: false
  },
});
//local
// const Pool = require("pg").Pool;

// const pool = new Pool({
//     user: "postgres",
//     password: "phuoc190301",
//     database: "eclass",
//     host: "localhost",
//     port: 5432
// });

module.exports = pool;