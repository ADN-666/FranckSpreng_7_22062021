/* fichier contenant la déclaration de la route permettant le signup avec le middleware de validation pour le mail
 et le login de l'utilisateur */

const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const valid = require("../middleware/valid");
const auth = require("../middleware/auth");

router.post("/signup", valid, usersCtrl.signup);
router.get("/login", usersCtrl.login);
router.get("/all", auth, usersCtrl.getAllUsers);
router.get("/:id", auth, usersCtrl.getOneUser);
router.get("/me/:id", auth, usersCtrl.getUserProfile);
router.put("/me/:id", auth, usersCtrl.updateProfile);
router.delete("/me/:id", auth, usersCtrl.deleteUser);

module.exports = router;
