const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const { validateCreateUser } = require("./validetionUser");

// Маршрути для app
// POST
router.post("/register", validateCreateUser, ctrl.reg);
router.post("/login", ctrl.login); // get token
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.currentUser);
router.patch("/", guard, ctrl.updateSub);

module.exports = router;
