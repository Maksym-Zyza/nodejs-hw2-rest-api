const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("./validation");

// Маршрути для app
// GET
router.get("/", ctrl.getAll);

// GET BY ID
router.get("/:contactId", ctrl.getById);

// POST
router.post("/", validateCreateContact, ctrl.add);

// DELETE
router.delete("/:contactId", ctrl.remove);

// PUT
router.put("/:contactId", validateUpdateContact, ctrl.update);

// PATCH
router.patch("/:contactId/favorite", validateUpdateFavorite, ctrl.update);

module.exports = router;
