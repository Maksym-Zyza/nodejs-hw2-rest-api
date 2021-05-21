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

// CREATE
const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

// UPDETE TOKEN
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = { findById, findByEmail, create, updateToken };
