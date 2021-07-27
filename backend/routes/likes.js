/* fichier contenant la déclaration de la route permettant de liker une sauce avec utilisation
de la middleware d'authentification ainsi que du controller like avec sa fonction de création de like */

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const likesCtrl = require("../controllers/likes");

router.post("/:postId/like", auth, likesCtrl.createLikes);
router.get("/like/all", auth, likesCtrl.getLikes);

module.exports = router;
