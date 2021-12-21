const pool = require('../config/dbconnect')

exports.findOne = (email)=>{
    return pool.query(
        `SELECT * FROM "user"
        WHERE email = $1;`,[email]
    )
}

exports.findAll = (page)=>{
    return pool.query(
        `SELECT * FROM "user"
        ORDER BY _id 
        LIMIT $1 OFFSET $2`,[10,page*10]
    )
}

exports.addUser = (name,email,hashedPassword,type,gender,birthday)=>{
    return pool.query(
        `INSERT INTO "user"(user_name,email,password,type, gender, birthday)
        VALUES ($1,$2,$3,$4,$5,$6);`, [name,email,hashedPassword,parseInt(type),gender,birthday]
    )
}

exports.deleteUser = (id)=>{
    return pool.query(
        `DELETE FROM "user"
        WHERE _id=$1`,[id]
    )
}

exports.updateuser = (name,gender,birthday,address,_id)=>{
    pool.query(
        `UPDATE "user" 
        SET user_name = $1, gender=$2, birthday=$3, address = $4
        WHERE _id= $5;`,[name,gender,birthday,address,_id]
    )
}
