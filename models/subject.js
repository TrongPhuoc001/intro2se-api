const pool = require('../config/dbconnect');

exports.getAllSubject = pool.query(
    `SELECT * FROM subject;`
)