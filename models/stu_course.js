const pool = require('../config/dbconnect');

exports.getAll = (page)=>{
    return pool.query(
        `SELECT user_name, course_name, TO_CHAR(day_start,'yyyy-mm-dd') as day_start
        FROM student_course, "user", course
        WHERE student_course.student_id = "user"._id
        AND student_course.course_id = course._id
        LIMIT 10 OFFSET $1;`,[page*10]
    )
}