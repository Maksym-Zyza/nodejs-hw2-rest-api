const Contacts = require("../model/contacts");

// Контролери для маршрутів
// GET
const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id; // Отримуємо userId з guard
    const { contacts, total, limit, page } = await Contacts.getAll(
      userId,
      req.query
    );
    return res.json({
      status: "success",
      code: 200,
      data: { total, limit, page, contacts },
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await await Contacts.getById(userId, req.params.contactId);
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
    const userId = req.user.id;
    const contact = await Contacts.create({ ...req.body, owner: userId });
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
    const userId = req.user.id;
    const contact = await Contacts.remove(userId, req.params.contactId);
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

// UPDATE
const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.update(
      userId,
      req.params.contactId,
      req.body
    );
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
