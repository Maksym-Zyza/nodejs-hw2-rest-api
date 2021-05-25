const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require("./validation");

// Маршрути для app
// GET
router.get("/", guard, ctrl.getAll);

// GET BY ID
router.get("/:contactId", guard, ctrl.getById);

// POST
router.post("/", guard, validateCreateContact, ctrl.add);

// DELETE
router.delete("/:contactId", guard, ctrl.remove);

// PUT
router.put("/:contactId", guard, validateUpdateContact, ctrl.update);

// PATCH
router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateFavorite,
  ctrl.update
);

module.exports = router;
