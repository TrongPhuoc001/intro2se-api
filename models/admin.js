const pool = require('../config/dbconnect');

exports.findOne = (username)=>{
    return pool.query(
        `SELECT * FROM admin WHERE admin_name = $1`,[username]
    )
}
exports.findAll = pool.query(
    `SELECT * FROM admin`
)