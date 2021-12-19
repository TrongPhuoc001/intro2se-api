const pool = require('../config/dbconnect')

const limit = 10;

exports.teacherCourse = (user_id)=>{
    return pool.query(
        `SELECT course_name, subject_id,time_start,time_end,day_study FROM course
        WHERE teacher_id=$1 AND curr_state = 1 `,[user_id]
    )
}

exports.studentCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id,course_name, user_name as teacher_name,course_id,subject_id,time_start,time_end,day_study
        FROM course, student_course, "user"
        WHERE student_id=$1 
        AND course_id = course._id
        AND "user"._id = course.teacher_id
        AND curr_state = 1;`,[user_id]
    )
}

exports.teacherAllCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id, course_name, subject_id,time_start,time_end,day_study,curr_state FROM course
        WHERE teacher_id=$1  `,[user_id]
    )
}

exports.studentAllCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id,course_name, user_name as teacher_name,subject_id,time_start,time_end,day_study,curr_state
        FROM course, student_course, "user"
        WHERE student_id=$1 
        AND course_id = course._id
        AND "user"._id = course.teacher_id;`,[user_id]
    )
}

exports.getAll = (page)=>{
    return pool.query(
        `SELECT course._id, course_name, teacher_id,user_name as teacher_name,subject_id, time_start, time_end, day_study, day_start, curr_state FROM course,"user" WHERE course.teacher_id = "user"._id ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit]
    )
}

exports.getAvailable = (page)=>{
    return pool.query(
        `SELECT course._id, course_name, subject_id, teacher_id,user_name as teacher_name,time_start, time_end, day_study,day_start  FROM course,"user"
        WHERE curr_state=0 AND course.teacher_id = "user"._id ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit]
    )
}

exports.searchCourse = (q,page)=>{
    return pool.query(
        `SELECT _id, course_name, subject_id, time_start, time_end, day_study,day_start,day_end, fee FROM course
        WHERE curr_state = 0 AND lower(course_name) LIKE $1 ORDER BY create_time DESC LIMIT $2 OFFSET $3;`,[q,limit,parseInt(page)*limit]
    )
}

exports.findOne = (_id)=>{
    return pool.query(
        `SELECT user_name as teacher_name,course.* FROM course,"user"
        WHERE course._id=$1
        AND "user"._id=course.teacher_id;`,[_id]
    )
}

exports.addCourse = (course_name,teacher_id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee)=>{
    return pool.query(
        `INSERT INTO course(course_name, teacher_id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`, [course_name,teacher_id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee]
    )
}

exports.getCourseStatus = (courseId)=>{
    return pool.query(
        `SELECT curr_state, max_slot FROM course
        WHERE _id = $1;`,[courseId]
    )
}

exports.countCourseStudent = (courseId)=>{
    return pool.query(
        `SELECT COUNT(*) FROM student_course
        WHERE course_id=$1;`,[courseId]
    )
}

exports.signToCourse = (userId,courseId)=>{
    return pool.query(
        `INSERT INTO student_course(student_id,course_id)
        VALUES ($1,$2);`,[userId,courseId]
    )
}

exports.deleteCourse = (courseId)=>{
    return pool.query(
        `DELETE FROM course
        WHERE _id = $1;`,[courseId]
    )
}

exports.unsign = (userId,courseId)=>{
    return pool.query(
        `DELETE FROM courses_stu
        WHERE stu_id = $1 AND course_id = $2;`,[userId,courseId]
    )
}

exports.startCourse = (courseId,teacerId)=>{
    return pool.query(
        `UPDATE course  SET curr_state = 1 WHERE _id=$1 AND teacher_id = $2;`,[courseId,teacerId]
    )
}
exports.endCourse = (courseId)=>{
    return pool.query(
        `UPDATE course SET curr_state = 2 WHERE course_id=$1;`,[courseId]
    )
}