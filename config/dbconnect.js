
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL||"postgres://npuaehxhtmcvup:ad2a389065a40abfa8d6f42b52e32432e980e0847d800b852620b34efdb6705a@ec2-52-23-87-65.compute-1.amazonaws.com:5432/d1b85jpdn6qqbi",
  ssl:{
    rejectUnauthorized: false
  },
});



module.exports = pool;