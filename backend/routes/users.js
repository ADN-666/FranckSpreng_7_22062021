const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const valid = require("../middleware/valid");
const validUpdate = require("../middleware/validUpdate");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/signup", multer, valid, usersCtrl.signup);
router.post("/login", usersCtrl.login);
router.get("/all", auth, usersCtrl.getAllUsers);
router.get("/me/:id", auth, usersCtrl.getUserProfile);
router.put("/me/:id", auth, multer, validUpdate, usersCtrl.updateProfile);
router.delete("/me/:id", auth, usersCtrl.deleteUser);

module.exports = router;
