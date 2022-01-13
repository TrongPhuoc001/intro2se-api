const pool = require("../config/dbconnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValid, loginValid } = require("../helper/validation");

const courseModel = require("../models/course");
const userModel = require("../models/user");

exports.getCourse = async (req, res) => {
  if (req.user._id != req.params.userId) {
    return res.status(400).json({ message: "token not match user" });
  }
  if (req.user.type === 1) {
    try {
      const result = await courseModel.teacherCourse(req.user._id);
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(400).json(err.routine);
    }
  }
  if (req.user.type === 2) {
    try {
      const result = await courseModel.studentCourse(req.user._id);
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(400).json(err.routine);
    }
  }
};

exports.getAllCourse = async (req, res) => {
  if (req.user._id != req.params.userId) {
    return res.status(400).json({ message: "token not match user" });
  }
  if (req.user.type === 1) {
    try {
      const result = await courseModel.teacherAllCourse(req.user._id);
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(400).json(err.routine);
    }
  }
  if (req.user.type === 2) {
    try {
      const result = await courseModel.studentAllCourse(req.user._id);
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(400).json(err.routine);
    }
  }
};

exports.postLogin = async (req, res) => {
  const { error } = loginValid(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;
  try {
    const result = await userModel.findOne(email);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Email or password is invalid" });
    }
    user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email or password is invalid" });
    }
    if (user.status == false) {
      return res.status(400).json({ message: "Account Was Ban!" });
    }

    const token = jwt.sign(
      { _id: user._id, type: user.type },
      process.env.TOKEN_SECRET
    );
    return res
      .header("auth", token)
      .status(200)
      .json({ message: "Login successful!", user });
  } catch (err) {
    return res.status(400).json(err.routine);
  }
};

exports.postRegister = async (req, res) => {
  const { error } = registerValid(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, password, type, gender, birthday } = req.body;
  try {
    const result = await userModel.findOne(email);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "email has already been taken" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.addUser(
        name,
        email,
        hashedPassword,
        type,
        gender,
        birthday
      );
      return res.status(200).json({ message: "Account create successful" });
    } catch (err) {
      return res.status(400).json(err);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  if (req.user._id != req.params.user_id) {
    return res.status(400).json({ message: "Token not match user" });
  }
  try {
    await userModel.deleteUser(req.user._id);
    return res.status(200).json({ message: "Delete success." });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  if (req.user._id != req.params.user_id) {
    return res.status(400).json({ message: "Token not match user" });
  }
  const { name, gender, birthday, address } = req.body;
  try {
    const result = await userModel.updateuser(
      name,
      gender,
      birthday,
      address,
      req.user._id
    );
    return res.json({ message: "Update success" });
  } catch (err) {
    return res.status(400).json(err.routine);
  }
};

exports.getFee = async (req, res) => {
  if (req.user._id != req.params.user_id) {
    return res.status(400).json({ message: "Token not match user" });
  }
  if (req.user.type === 2) {
    const courseFee = await userModel.getCourseFee(req.user._id);
    const sumFee = await userModel.getSumFee(req.user._id);
    return res
      .status(200)
      .json({ course: courseFee.rows, sum: sumFee.rows[0].sum });
  } else if (req.user.type === 1) {
    const courseFee = await userModel.getCourseFeeTeacher(req.user._id);
    const sumFee = await userModel.getSumFeeTeacher(req.user._id);
    return res
      .status(200)
      .json({ course: courseFee.rows, sum: sumFee.rows[0].sum });
  }
};
