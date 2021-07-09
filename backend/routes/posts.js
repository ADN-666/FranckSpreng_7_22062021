/* fichier contenant la déclaration de la route permettant d'acceder à un article avec utilisation
de la middleware d'authentification ainsi que multer pour la photo accompagnant l'article.
Déclaration du controller articles avec ses différentes fonctions pour la gestion des articles */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const postsCtrl = require("../controllers/posts");

router.post("/", auth, postsCtrl.createPost);
router.get("/all", auth, postsCtrl.getAllPost);
router.get("/:id", auth, postsCtrl.getOnePost);
router.put("/:id", auth, postsCtrl.updatePost);
router.delete("/:id", auth, postsCtrl.deletePost);

module.exports = router;
