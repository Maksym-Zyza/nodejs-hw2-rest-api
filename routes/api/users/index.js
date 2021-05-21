const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

// Маршрути для app
// POST
router.post("/register", ctrl.reg);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);

module.exports = router;
