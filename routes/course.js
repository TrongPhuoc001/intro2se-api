const express = require("express");
const pool = require("../dbconnect");
const verify = require("../verifyToken");
const { courseValid } = require("../validation");
const router = express.Router();

router.get('/all', verify, (req,res)=>{
    pool.query(
        `SELECT _id, name, subject_id, time_start, time_end, day_stu, max_solt, fee, curr_state FROM courses;`,
        (err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(result.rows);
        }
    )
})
router.get('/available', verify, (req,res)=>{
    pool.query(
        `SELECT _id, name, subject_id, time_start, time_end, day_stu, fee FROM courses
        WHERE curr_state=0;`,(err,result)=>{
            if(err){
                return res.status(400).json(err.routine);
            }
            return res.status(200).json(result.rows);
        }
    )
})

router.get("/:courseId", (req,res) => {
    pool.query(
        `SELECT * FROM courses
        WHERE _id=$1;`,[req.params.courseId],(err,result)=>{
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
    }
    if(req.user.type === 2){
        const {courseId} = req.query;
        pool.query(
            `SELECT curr_state, max_slot FROM courses
            WHERE _id = $1;`,[courseId],
            (err,result)=>{
                if(err){
                    return res.status(400).json(err)
                }
                course_state = result.rows[0];
                if(parseInt(course_state.curr_state) === 0){
                    pool.query(
                        `SELECT COUNT(*) FROM courses_stu 
                        WHERE course_id=$1;`,[courseId],(err,result)=>{
                            if(err){
                                return res.status(400).json(err.routine);
                            }
                            if(result.rows[0].count < course_state.max_slot){
                                pool.query(
                                    `INSERT INTO courses_stu(stu_id,course_id)
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
    if(req.user.type === 1){
        pool.query(
            `SELECT * FROM courses
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
                        `DELETE FROM courses
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
    if(req.user.type === 2){
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

module.exports = router;