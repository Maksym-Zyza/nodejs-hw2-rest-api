const Contacts = require("../model/contacts");

// Контролери для маршрутів
// GET
const getAll = async (req, res, next) => {
  try {
    const contacts = await Contacts.getAll();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getById = async (req, res, next) => {
  try {
    const contact = await Contacts.getById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found contact by Id" });
  } catch (error) {
    next(error);
  }
};

// POST
const add = async (req, res, next) => {
  try {
    const contact = await Contacts.add(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    if (error.name === "ValidatorError") {
      error.status = 400;
    }
    next(error);
  }
};

// DELETE
const remove = async (req, res, next) => {
  try {
    const contact = await Contacts.remove(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found contact by Id" });
  } catch (error) {
    next(error);
  }
};

// PUT
const update = async (req, res, next) => {
  try {
    const contact = await Contacts.update(req.params.contactId, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found contact by Id" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
};
