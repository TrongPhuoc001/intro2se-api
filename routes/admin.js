const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../dbconnect");
const router = express.Router();
let auth = false;

const check_auth = (req,res,next)=>{
    console.log(auth);
    if(auth === true){
        setTimeout(()=>{auth=false},900000);
        next();
    }
    else{
        res.redirect('./login');
    }
}

router.get('/', (req, res) => {
    res.redirect('./admin/login');
})
router.get('/login', (req, res) => {
    res.render('login', { message: req.query.message});
})
router.get('/dashboard',check_auth,(req,res)=>{
    const arr =['courses', 'courses_stu','subject','users'];
    res.render('index',{data:JSON.stringify(arr)});
})
router.get('/dashboard/:table_name', (req,res)=>{
    pool.query(
        `SELECT * FROM ${req.params.table_name};`,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(results.rows);
        }
    )
})

router.delete('/dashboard/:table_name/:record_id', (req,res)=>{
    pool.query(
        `DELETE FROM ${req.params.table_name}
        WHERE _id=${req.params.record_id};`,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(results.rows);
        }
    )
})

router.post('/dashboard/:table_name', async (req,res)=>{
    const tb_name = req.params.table_name;
    switch(tb_name){
        case 'courses':
            const {name, subject_id, time_start, time_end, day_study, max_slot,fee} = req.body;
            pool.query(
                `INSERT INTO courses(name, creator_id, subject_id, time_start, time_end, day_study, max_slot,fee)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`, [name,req.user._id, subject_id, time_start, time_end, day_study, max_slot,fee], (err,result)=>{
                    if(err){
                        return res.json(err.routine);
                    }
                    return res.status(200).json({"message":"create success"});
                }
            )
            break;
        case 'courses_stu':
            const {stu_id,course_id} = req.body;
            pool.query(
                `INSERT INTO courses_stu(stu_id,course_id)
                VALUES ($1,$2);`,[stu_id,course_id],(err,results)=>{
                    if(err){
                        return res.status(400).json(err.routine);
                    }
                    return res.status(200).json({"message":"create success"});
                }
            )
            break;
        case 'subject':
            const {sub_name} = req.body;
            pool.query(
                `INSERT INTO subject(name)
                VALUES ($1);`,[sub_name],(err,results)=>{
                    if(err){
                        return res.status(400).json(err.routine);
                    }
                    return res.status(200).json({"message":"create success"});
                }
            )
            break;
        case 'users':
            const {user_name , email, password, type, gender, birth} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            pool.query(
                `SELECT * FROM users
                WHERE email = $1;`, [email], (err,result)=>{
                    if(err){
                        return res.status(400).json(err);
                    }
                    if(result.rows.length > 0 ){
                        return res.status(400).json({"message": "email has already been taken"});
                    }
                    else {
                        pool.query(
                            `INSERT INTO users(name,email,password,type, gender, birth)
                            VALUES ($1,$2,$3,$4,$5,$6);`, [user_name,email,hashedPassword,parseInt(type),gender,birth], (err,result)=>{
                                if(err){
                                    return res.json(err);
                                }
                                return res.status(200).json({"message": "Account create successful"});
                            }
                        )
                    }
                }
            )
            break;
    }
})

router.post('/login', (req,res)=>{
    const {username,password} = req.body;
    if(username === 'admin' && password === 'spectre'){
        auth = true;
        return res.redirect('./dashboard');
    }
    else{
        res.render('login', { message: "Invalid username or password"});
    }   
})


module.exports = router;