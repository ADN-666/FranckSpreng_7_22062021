/* fichier contenant la déclaration de la route permettant de liker une sauce avec utilisation
de la middleware d'authentification ainsi que du controller like avec sa fonction de création de like */

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const commentsCtrl = require("../controllers/comments");

router.post("/:postId/comments", auth, commentsCtrl.createComment);
router.get("/:postId/comments/:id", auth, commentsCtrl.getOneComment);
router.put("/:postid/comments/:id", auth, commentsCtrl.updateComment);
router.delete("/:postid/comments/:id", auth, commentsCtrl.deleteComment);

module.exports = router;
