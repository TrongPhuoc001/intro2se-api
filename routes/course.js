const express = require("express");
const pool = require("../dbconnect");
const verify = require("../verifyToken");
const { courseValid } = require("../validation");
const router = express.Router();


const limit = 10;

router.get('/all', (req,res)=>{
    const page = req.query.page||0;
    pool.query(
        `SELECT course._id, course_name, teacher_id,user_name as teacher_name,subject_id, time_start, time_end, day_study, day_start, curr_state FROM course,"user" WHERE course.teacher_id = "user"._id ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit],
        (err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(result.rows);
        }
    )
})
router.get('/available', (req,res)=>{
    const page = req.query.page||0;
    pool.query(
        `SELECT course._id, course_name, subject_id, teacher_id,user_name as teacher_name,time_start, time_end, day_study,day_start  FROM course,"user"
        WHERE curr_state=0 AND course.teacher_id = "user"._id ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit],(err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(result.rows);
        }
    )
})

router.get('/subject',(req,res)=>{
    pool.query(
        `SELECT * FROM subject;`,(err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(result.rows);
        }
    )
})

router.get('/search', (req,res)=>{
    const q ='%'+ (req.query.q||'').toLowerCase() + '%';
    const page = req.querypage||0; 
    pool.query(
        `SELECT _id, course_name, subject_id, time_start, time_end, day_study,day_start,day_end, fee FROM course
        WHERE curr_state = 0 AND lower(course_name) LIKE $1 ORDER BY create_time DESC LIMIT $2 OFFSET $3;`,[q,limit,page],
        (err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.json(result.rows);
        }
    )
})

router.get('/search/subject',(req,res)=>{
    const {q} = req.query;
    const page = req.query.page || 0;

    pool.query(
        `SELECT _id, course_name, subject_id, time_start, time_end, day_study,day_start,day_end, fee FROM course
        WHERE curr_state = 0 AND subject_id=$1 ORDER BY create_time DESC LIMIT $2 OFFSET $3;`,[q,limit,page],
        (err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.json(result.rows);
        }
    )
})

router.get("/:courseId", (req,res) => {
    pool.query(
        `SELECT user_name as teacher_name,course.* FROM course,"user"
        WHERE course._id=$1
        AND "user"._id=course.teacher_id;`,[req.params.courseId],(err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            if(result.rows.length < 1){
                return res.status(404).json({"message":"Course not found"});
            }
            return res.status(200).json(result.rows[0]);
        }
    )
});

router.post("/:userId/sign", verify, (req,res) => {
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    if(req.user.type === 1){
        const {error} = courseValid(req.body);
        if(error){
            return res.status(400).json({"message" :error.details[0].message});
        }
        const {course_name, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee} = req.body;
        pool.query(
            `INSERT INTO course(course_name, teacher_id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`, [course_name,req.user._id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee], (err,result)=>{
                if(err){
                    return res.json(err.routine);
                }
                return res.status(200).json({"message":"create success"});
            }
        )
    }
    if(req.user.type === 2){
        const {courseId} = req.query;
        pool.query(
            `SELECT curr_state, max_slot FROM course
            WHERE _id = $1;`,[courseId],
            (err,result)=>{
                if(err){
                    return res.status(400).json(err)
                }
                course_state = result.rows[0];
                if(parseInt(course_state.curr_state) === 0){
                    pool.query(
                        `SELECT COUNT(*) FROM student_course
                        WHERE course_id=$1;`,[courseId],(err,result)=>{
                            if(err){
                                return res.status(400).json(err.routine);
                            }
                            if(result.rows[0].count < course_state.max_slot){
                                pool.query(
                                    `INSERT INTO student_course(student_id,course_id)
                                    VALUES ($1,$2);`,[req.user._id,courseId],(err,results)=>{
                                        if(err){
                                            return res.status(400).json(err.routine);
                                        }
                                        return res.status(200).json({"message":"sign success"});
                                    }
                                )
                            }
                            else {
                                return res.status(400).json({"message":"Course is full"});
                            }
                        }
                    )
                }
            }
        )
    }
});

router.delete("/:userId/unsign/:courseId", verify, (req,res) => {
    const {userId,courseId} = req.params;
    if(req.user._id != userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    if(req.user.type === 2){
        pool.query(
            `SELECT * FROM course
            WHERE _id = $1;`,[courseId],(err,result)=>{
                if(err){
                    return res.status(400).json(err.routine);
                }
                if(result.rows.length < 1){
                    return res.status(404).json({"message":"Course not found"});
                }
                const course = result.rows[0];
                if(req.user._id === course.creator_id){
                    pool.query(
                        `DELETE FROM course
                        WHERE _id = $1;`,[req.params.courseId],(err,result)=>{
                            if(err){
                                return res.status(400).json(err.routine);
                            }
                            return res.status(200).json({"message":"Delete success"});
                        }
                    )
                }
            }
        )
    }
    if(req.user.type === 3){
        pool.query(
            `DELETE FROM courses_stu
            WHERE stu_id = $1 AND course_id = $2;`,[req.user._id,courseId],
            (err,result)=>{
                if(err){
                    return res.status(400).json(err)
                }
                return res.status(200).json({"message":"Unsign success"});
            }
        )
    }
});

router.put('/:userId/start', verify,(req,res)=>{
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    const {courseId} = req.query; 
    pool.query(
        `UPDATE course  SET curr_state = 1 WHERE _id=$1;`,[courseId],
        (err,result)=>{ 
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.json({message:"Course start"});
        }
    )
})

router.put('/:userId/end', verify,(req,res)=>{
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    const {course_id} = req.query; 
    pool.query(
        `UPDATE TABLE course WHERE course_id=$1 SET curr_state = 2;`,[course_id],
        (err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.json({message:"Course start"});
        }
    )
})

module.exports = router;