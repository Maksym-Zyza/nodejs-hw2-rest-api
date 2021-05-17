const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("./validation");

// Опис роутів для app
// GET
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

// GET BY ID
router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found contact by Id" });
  } catch (error) {
    next(error);
  }
});

// POST
router.post("/", validateCreateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    if (error.name === "ValidatorError") {
      error.status = 400;
    }
    next(error);
  }
});

// DELETE
router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found contact by Id" });
  } catch (error) {
    next(error);
  }
});

// PUT
router.put("/:contactId", validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
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
});

// PATCH
router.patch(
  "/:contactId/favorite",
  validateUpdateFavorite,
  async (req, res, next) => {
    try {
      const contact = req.body.hasOwnProperty("favorite")
        ? await Contacts.updateContact(req.params.contactId, req.body)
        : { message: "missing field favorite" };

      if (contact) {
        return res
          .status(200)
          .json({ status: "success", code: 200, data: { contact } });
      }
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found contact by Id",
      });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
