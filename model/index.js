const Contact = require("./schemas/contact");

// GET
const listContacts = async () => {
  const results = await Contact.find({});
  return results;
};

// GET BY ID
const getContactById = async (id) => {
  const result = await Contact.findOne({ _id: id });
  return result;
};

// DELETE
const removeContact = async (id) => {
  const result = await Contact.findByIdAndRemove({ _id: id });
  return result;
};

// POST
const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

// UPDATE
const updateContact = async (id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
