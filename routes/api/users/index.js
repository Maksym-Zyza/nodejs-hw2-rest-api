const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const { validateCreateUser } = require("./validetionUser");
const upload = require("../../../helpers/upload");

// Маршрути для app
router.get("/verify/:token", ctrl.verify);
router.post("/verify", ctrl.repeatEmailVerify);
router.post("/register", validateCreateUser, ctrl.reg);
router.post("/login", ctrl.login); // get token
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.currentUser);
router.patch("/", guard, ctrl.updateSub);
router.patch("/avatars", [guard, upload.single("avatar")], ctrl.avatars);

module.exports = router;
