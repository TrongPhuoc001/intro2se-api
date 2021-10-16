const express = require("express");
const pool = require("../dbconnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValid, loginValid } = require("../validation");
const verify = require("../verifyToken");
const router = express.Router();


router.get("/:userId/courses", verify, (req,res)=>{
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    if(req.user.type === 1){
        pool.query(
            `SELECT name,time_start,time_end,day_study,fee FROM courses
            WHERE creator_id=$1;`,[req.user._id],(err,result)=>{
                if(err){
                    return res.status(400).json(err.routine);
                }
                return res.status(200).json(result.rows);
            }
        )
    }
    if(req.user.type === 2){
        pool.query(
            `SELECT name,time_start,time_end,day_study,fee FROM courses,courses_stu 
            WHERE courses_stu.stu_id=$1 
            AND courses_stu.course_id = courses._id;`,[req.user._id],(err,result)=>{
                if(err){
                    return res.status(400).json(err);
                }
                return res.status(200).json(result.rows);
            }
        )
    }
   
    
});

router.post('/login', async (req,res) => {
    const {error} = loginValid(req.body);
    if(error){
        return res.status(400).json({"message" :error.details[0].message})
    }
    const {email, password} = req.body;
    pool.query(
        `SELECT * FROM users
        WHERE email = $1;`,[email],async (err,result)=>{
            if(result.rows.length === 0 ){
                return res.status(400).json({"message":"Email or password is invalid"});
            }
            user = result.rows[0];
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(400).json({"message":"Email or password is invalid"});
            }

            const token = jwt.sign({_id : user._id,type: user.type}, process.env.TOKEN_SECRET);
            return res.header('auth', token).status(200).json({"message": "Login successful!",user});
        }
    )
});

router.post('/register', async (req,res) => {
    const {error} = registerValid(req.body);
    if(error){
        return res.status(400).json({"message" :error.details[0].message})
    }
    const {name , email, password, type, gender, birth} = req.body;
    console.log(
        name,
        email,
        password,
        type,
        gender,
        birth
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    pool.query(
        `SELECT * FROM users
        WHERE email = $1;`, [email], (err,result)=>{
            if(err){
                console.log(err);
            }
            if(result.rows.length > 0 ){
                return res.status(400).json({"message": "email has already been taken"});
            }
            else {
                pool.query(
                    `INSERT INTO users(name,email,password,type, gender, birth)
                    VALUES ($1,$2,$3,$4,$5,$6);`, [name,email,hashedPassword,parseInt(type),gender,birth], (err,result)=>{
                        if(err){
                            return res.json(err);
                        }
                        return res.status(200).json({"message": "Account create successful"});
                    }
                )
            }
        }
    )
});

router.delete("/delete", verify,(req,res)=>{
    pool.query(
        `DELETE FROM users
        WHERE _id=$1`,[req.user._id],(err,result)=>{
            if(err){
                return res.status(400).json(err);
            }
            return res.status(200).json({"message":"Delete success."});
        }
    )
});



module.exports = router;