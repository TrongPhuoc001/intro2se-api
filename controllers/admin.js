
const bcrypt = require("bcryptjs");
const pool = require("../config/dbconnect");
const {registerValid, courseValid} = require('../helper/validation');
const passport = require('../config/passport');

exports.index = async(req, res) => {
    res.redirect('./admin/login');
}

exports.getLogin = async(req, res) => {
    res.render('login', { message: req.query.message});
}

exports.getDashboard = async(req,res)=>{
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
}

exports.getTable = async(req,res)=>{
    pool.query(
        `SELECT * FROM "${req.params.table_name}" ORDER BY _id DESC;`,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(results.rows);
        }
    )
}

exports.delRecord = async(req,res)=>{
    pool.query(
        `DELETE FROM ${req.params.table_name}
        WHERE _id=${req.params.record_id};`,(err,results)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(results.rows);
        }
    )
}

exports.postTable =async (req,res)=>{
    const tb_name = req.params.table_name;
    if(tb_name==='course'){
        const {error} = courseValid(req.body);
        if(error){
            return res.status(400).json({"message" :error.details[0].message});
        }
        const {course_name,teacher_id, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee} = req.body;
        pool.query(
            `INSERT INTO course(course_name, teacher_id, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`, [course_name,teacher_id, subject_id, time_start, time_end, day_study,day_start, day_end, max_slot,fee], (err,result)=>{
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
    else if (tb_name==='course_task'){
        const {course_id, content, task_endtime}= req.body;
        pool.query(
            `INSERT INTO course_task(course_id,content,task_endtime)
            VALUES ($1,$2,$3)`, [course_id,content, task_endtime],
            (err,result)=>{
                if(err){
                    return res.status(400).json(err.routine)
                }
                return res.status(200).json({message:"Create success"})
            }
        )
    }
    else if(tb_name==='discuss'){
        const {user_id,course_id,content} = req.body;
        pool.query(
            `INSERT INTO discuss(user_id,course_id,content)
            VALUES ($1,$2,$3)`,[user_id,course_id,content],
            (err,result)=>{
                if(err){
                    return res.status(400).json(err.routine);
                }
                return res.status(200).json({message:"Create success"});
            }
        )
    }
    
}

exports.postLogin = passport.authenticate('local', { 
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login?error=true'
});