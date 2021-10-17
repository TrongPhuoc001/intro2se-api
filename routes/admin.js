const express = require("express");
const pool = require("../dbconnect");
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('./admin/login');
})
router.get('/login', (req, res) => {
    res.render('login', { message: req.query.message});
})

router.post('/login', (req,res)=>{
    const {username,password} = req.body;
    if(username === 'admin' && password === 'spectre'){
        pool.query(
            'SELECT * FROM courses;SELECT * FROM courses_stu;SELECT * FROM subject;SELECT * FROM users;',
            (err,results)=>{
                if(err){
                    res.render('index',{message: "query error"});
                }
                const mydata = {
                    courses : results[0].rows,
                    courses_stu: results[1].rows,
                    subject: results[2].rows,
                    users: results[3].rows
                };
                res.render('index', {data: JSON.stringify(mydata)});
            }
        )
    }
    else{
        res.render('login', { message: "Invalid username or password"});
    }   
})



module.exports = router;