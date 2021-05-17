const Contact = require("./schemas/contact");

// GET
const getAll = async () => {
  const results = await Contact.find({});
  return results;
};

// GET BY ID
const get = async (id) => {
  const result = await Contact.findOne({ _id: id });
  return result;
};

// POST
const add = async (body) => {
  const result = await Contact.create(body);
  return result;
};

// DELETE
const remove = async (id) => {
  const result = await Contact.findByIdAndRemove({ _id: id });
  return result;
};

// UPDATE
const update = async (id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  getAll,
  get,
  remove,
  add,
  update,
};
