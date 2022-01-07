const pool = require('../config/dbconnect')

const limit = 10;

exports.teacherCourse = (user_id)=>{
    return pool.query(
        `SELECT course_name, subject.subject_name as subject_name, subject.color as color,time_start,time_end,day_study FROM course,subject
        WHERE teacher_id=$1
        AND course.subject_id = subject._id 
        AND curr_state = 1 ;`,[user_id]
    )
}

exports.studentCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id,course_name, user_name as teacher_name,course_id,subject.subject_name as subject_name, subject.color as color,time_start,time_end,day_study
        FROM course, student_course, "user",subject
        WHERE student_id=$1
        AND course_id = course._id
        AND "user"._id = course.teacher_id
        AND course.subject_id = subject._id
        AND curr_state = 1;`,[user_id]
    )
}

exports.teacherAllCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id, course_name, subject.subject_name as subject_name, subject.color as color,time_start,time_end,day_study,TO_CHAR(day_start, 'yyyy-MM-DD') as day_start,TO_CHAR(day_end, 'yyyy-MM-DD') as day_end,curr_state FROM course,subject
        WHERE teacher_id=$1  
        AND course.subject_id=subject._id;`,[user_id]
    )
}

exports.studentAllCourse = (user_id)=>{
    return pool.query(
        `SELECT course._id,course_name, user_name as teacher_name,subject.subject_name as subject_name, subject.color as color,time_start,time_end,day_study,TO_CHAR(day_start, 'yyyy-MM-DD') as day_start,TO_CHAR(day_end, 'yyyy-MM-DD') as day_end,curr_state
        FROM course, student_course, "user",subject
        WHERE student_id=$1 
        AND course_id = course._id
        AND "user"._id = course.teacher_id
        AND course.subject_id=subject._id;`,[user_id]
    )
}

exports.getAll = (page)=>{
    return pool.query(
        `SELECT course._id, course_name, teacher_id,user_name as teacher_name,subject.subject_name as subject_name, subject.color as color, time_start, time_end, day_study, TO_CHAR(day_start, 'yyyy-MM-DD') as day_start, curr_state FROM course,"user" ,subject
        WHERE course.teacher_id = "user"._id 
        AND course.subject_id = subject._id
        ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit]
    )
}

exports.getAvailable = (page)=>{
    return pool.query(
        `SELECT course._id, course_name, subject.subject_name as subject_name, subject.color as color, teacher_id,user_name as teacher_name,time_start, time_end, day_study,TO_CHAR(day_start, 'yyyy-MM-DD') as day_start  FROM course,"user", subject
        WHERE curr_state=0 
        AND course.teacher_id = "user"._id 
        AND course.subject_id = subject._id
        ORDER BY create_time DESC LIMIT $1 OFFSET $2;`,[limit,parseInt(page)*limit]
    )
}

exports.searchCourse = (q,page,stateArr)=>{
    return pool.query(
        `SELECT course._id, course_name, subject.subject_name as subject_name, subject.color as color, time_start, time_end, day_study,TO_CHAR(day_start, 'yyyy-MM-DD') as day_start,day_end,curr_state ,fee FROM course, subject
        WHERE curr_state = ANY($1) 
        AND lower(course_name) LIKE $2 
        AND course.subject_id = subject._id
        ORDER BY create_time DESC LIMIT $3 OFFSET $4;`,[stateArr,q,limit,parseInt(page)*limit]
    )
}

exports.findOne = (_id)=>{
    return pool.query(
        `SELECT user_name as teacher_name,subject.subject_name as subject_name, subject.color as color,course.* 
        FROM course,"user",subject
        WHERE course._id=$1
        AND "user"._id=course.teacher_id
        AND course.subject_id = subject._id;`,[_id]
    )
}

exports.addCourse = (course_name,teacher_id, subject_id,description ,time_start, time_end, day_study, day_start, day_end, max_slot,fee)=>{
    return pool.query(
        `INSERT INTO course(course_name, teacher_id, subject_id,description ,time_start, time_end, day_study, day_start, day_end, max_slot,fee)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`, [course_name,teacher_id, subject_id, description,time_start, time_end, day_study, day_start, day_end, max_slot,fee]
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
        `DELETE FROM student_course
        WHERE student_id = $1 AND course_id = $2;`,[userId,courseId]
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
