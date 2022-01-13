const userModel = require("../../models/user");

exports.getListUser = async (req, res) => {
  const user_result = await userModel.findAll(0);
  console.log(user_result.rows);
  res.status(200).json(user_result.rows);
};

exports.putBanUser = async (req, res) => {
  const { id } = req.params;
  const result = await userModel.banUser(id);
  console.log(result);
  res.status(200).json(result);
};

exports.putUnBanUser = async (req, res) => {
  const { id } = req.params;
  const result = await userModel.unBanUser(id);
  console.log(result);
  res.status(200).json(result);
};
