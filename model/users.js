const User = require("./schemas/user");

// Функції для controllers users
// GET by ID
const findById = async (id) => {
  return await User.findOne({ _id: id });
};

// GET by Email
const findByEmail = async (email) => {
  return await User.findOne({ email });
};

// GET by VerifyToken
const getUserByVerifyToken = async (token) => {
  return await User.findOne({ verifyToken: token });
};

// CREATE
const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

// UPDETE TOKEN
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

// GET by TOKEN
const findByToken = async (token) => {
  return await User.findOne({ token });
};

// UPDETE Subscription
const updateUserSub = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

// UPDETE Avatar LOCAL
// const updateAvatar = async (id, avatar) => {
//   return await User.updateOne({ _id: id }, { avatar });
// };

// UPDETE Avatar CLOUD
const updateAvatar = async (id, avatar, userIdImg = null) => {
  return await User.updateOne({ _id: id }, { avatar, userIdImg });
};

// UPDETE VerifyToken
const updateVerifyToken = async (id, verify, token) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken: token });
};

module.exports = {
  findById,
  findByEmail,
  getUserByVerifyToken,
  create,
  updateToken,
  findByToken,
  updateUserSub,
  updateAvatar,
  updateVerifyToken,
};
