const pool = require("../config/dbconnect");
const verify = require("../helper/verifyToken");
const { courseValid } = require("../helper/validation");

const courseModel = require('../models/course');
const subjectModel = require('../models/subject');
const limit = 10;

exports.getAll = async(req,res)=>{
    const page = req.query.page||0;
    try{
        const result = await courseModel.getAll(page);
        return res.status(200).json(result.rows);
    }
    catch(err){
        return res.status(400).json(err.routine);
    }
}
exports.getAvai = async(req,res)=>{
    const page = req.query.page||0;
    try{
        const result = await courseModel.getAvailable(page);
        return res.status(200).json(result.rows);
    }
    catch(err){
        return res.status(400).json(err.routine);
    }
}

exports.getCourseSubject = async(req,res)=>{
    try{
        const result = await subjectModel.getAll;
        return res.status(200).json(result.rows);
    }
    catch(err){
        return res.status(400).json(err.routine);
    }
}

exports.searchCourse = async(req,res)=>{
    const q ='%'+ (req.query.q||'').toLowerCase() + '%';
    const page = req.query.page||0; 
    try{
        const result = await courseModel.searchCourse(q,page);
        return res.json(result.rows);

    }catch(err){
        console.log(err);
        return res.status(400).json(err.routine);
    }
}

exports.getCourse = async(req,res) => {
    const course_id = req.params.courseId;
    try{
        const result = await courseModel.findOne(course_id);
        if(result.rows.length > 0){
            return res.status(200).json(result.rows[0]);
        }
        return res.status(404).json({"message":"Course not found"});
        

    }
    catch(err){
        return res.status(400).json(err.routine);
    }
}

exports.postCourse = async(req,res) => {
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    if(req.user.type === 1){
        const {error} = courseValid(req.body);
        if(error){
            return res.status(400).json({"message" :error.details[0].message});
        }
        const {course_name, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee} = req.body;
        try{
            await courseModel.addCourse(course_name,req.user._id, subject_id, time_start, time_end, day_study, day_start, day_end, max_slot,fee);
            return res.status(200).json({"message":"create success"});
        }
        catch(err){
            return res.json(err.routine);
        }
    }
    if(req.user.type === 2){
        const {course_id} = req.body;
        try{
            const courseStatus = await courseModel.getCourseStatus(course_id);
            course_state = courseStatus.rows[0];
            if(parseInt(course_state.curr_state) === 0){
                const countStudent = await courseModel.countCourseStudent(course_id);
                if(countStudent.rows[0].count < course_state.max_slot){
                    await courseModel.signToCourse(req.user._id,course_id);
                    return res.status(200).json({"message":"sign success"});
                }
                else {
                    return res.status(400).json({"message":"Course is full"});
                }
            }
            else{
                return res.status(400).json({"message":"Course had started"});
            }
        }
        catch(err){
            return res.status(400).json(err)
        }
    }
}

exports.deleteOrUnsign = async(req,res) => {
    const {userId,courseId} = req.params;
    if(req.user._id != userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    if(req.user.type === 1){
        try{
            const findCourse = await courseModel.findOne(courseId)
            if(findCourse.rows.length < 1){
                return res.status(404).json({"message":"Course not found"});
            }
            const course = findCourse.rows[0];
            if(req.user._id === course.teacher_id){
                await courseModel.deleteCourse(courseId);
                return res.status(200).json({"message":"Delete success"});
            }
        }
        catch(err){
            return res.status(400).json(err.routine);
        }
    }
    if(req.user.type === 2){
        try{
            await courseModel.unsign(req.user._id,courseId);
            return res.status(200).json({"message":"Unsign success"});
        }
        catch(err){
            return res.status(400).json(err)
        }
    }
}

exports.startCourse = async(req,res)=>{
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    const {courseId} = req.query;
    try{
        await courseModel.startCourse(courseId,req.user._id);
        return res.json({message:"Course start"});
    } 
    catch(err){
        return res.status(400).json(err.routine);
    }
}

exports.endCourse = async(req,res)=>{
    if(req.user._id != req.params.userId){
        return res.status(400).json({"message" : "token not match user"})
    }
    const {course_id} = req.query; 
    try{
        await courseModel.endCourse(course_id);
        return res.json({message:"Course end"});
    }catch(err){
        return res.status(400).json(err.routine);
    }
}