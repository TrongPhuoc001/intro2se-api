const courseModel = require("../../models/course");

exports.getListCourse = async (req, res) => {
  const course_result = await courseModel.getAllList();
  console.log(course_result.rows);
  res.status(200).json(course_result.rows);
};

exports.putBanCourse = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await courseModel.banCourse(id);
  console.log(result);
  res.status(200).json(result);
};

exports.putUnBanCourse = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await courseModel.unBanCourse(id);
  console.log(result);
  res.status(200).json(result);
};
