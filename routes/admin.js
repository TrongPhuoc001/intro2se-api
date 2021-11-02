const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../dbconnect");
const {registerValid, courseValid} = require('../validation');
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
    console.log('dashboard');
    pool.query(
        `select
            t.table_name,
            array_agg(c.column_name::text) as columns
        from
            information_schema.tables t
        inner join information_schema.columns c on
            t.table_name = c.table_name
        where
            t.table_schema = 'public'
            and t.table_type= 'BASE TABLE'
            and c.table_schema = 'public'
            and is_nullable = 'NO'
        group by t.table_name;`,(err,result)=>{
            if(err){
                console.log(err);
                return res.json(err);
            }
            result.rows.forEach(table=>{
                const index = table.columns.indexOf('_id');
                if (index > -1) {
                    table.columns.splice(index, 1);
                }
            })
            return res.render('index',{data:JSON.stringify(result.rows)});
        }
    )
})
router.get('/dashboard/:table_name', (req,res)=>{
    pool.query(
        `SELECT * FROM "${req.params.table_name}";`,(err,results)=>{
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
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(results.rows);
        }
    )
})

router.post('/dashboard/:table_name', async (req,res)=>{
    const tb_name = req.params.table_name;
    if(tb_name==='course'){
        const {error} = courseValid(req.body);
        if(error){
            return res.status(400).json({"message" :error.details[0].message});
        }
        const {course_name, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee} = req.body;
        pool.query(
            `INSERT INTO course(course_name, teacher_id, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`, [course_name,req.user._id, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee], (err,result)=>{
                if(err){
                    return res.json(err.routine);
                }
                return res.status(200).json({"message":"create success"});
            }
        );
    }
    else if(tb_name === 'student_course'){ 
        const {student_id,course_id} = req.body;
        pool.query(
            `INSERT INTO student_course(student_id,course_id)
            VALUES ($1,$2);`,[student_id,course_id],(err,results)=>{
                if(err){
                    return res.status(400).json(err.routine);
                }
                return res.status(200).json({"message":"create success"});
            }
        )
    }
    else if(tb_name === 'subject'){
        const {subject_name} = req.body;
        pool.query(
            `INSERT INTO subject(subject_name)
            VALUES ($1);`,[subject_name],(err,results)=>{
                if(err){
                    return res.status(400).json(err.routine);
                }
                return res.status(200).json({"message":"create success"});
            }
        )
    }
    else if(tb_name==='user'){
        const {user_error} = registerValid(req.body);
        if(user_error){ 
            return res.status(400).json({"message" :user_error.details[0].message})
        }
        const {user_name , email, password, type, gender, birthday} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
            `SELECT * FROM "user"
            WHERE email = $1;`, [email], (err,result)=>{
                if(err){
                    return res.status(400).json(err);
                }
                if(result.rows.length > 0 ){
                    return res.status(400).json({"message": "email has already been taken"});
                }
                else {
                    pool.query(
                        `INSERT INTO "user"(user_name,email,password,type, gender, birthday)
                        VALUES ($1,$2,$3,$4,$5,$6);`, [user_name,email,hashedPassword,parseInt(type),gender,birthday], (err,result)=>{
                            if(err){
                                return res.json(err);
                            }
                            return res.status(200).json({"message": "Account create successful"});
                        }
                    )
                }
            }
        )
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