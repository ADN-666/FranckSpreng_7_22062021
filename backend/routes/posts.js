const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const postsCtrl = require("../controllers/posts");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, postsCtrl.createPost);
router.get("/all", auth, postsCtrl.getAllPost);
router.get("/:userId", auth, postsCtrl.getUserPost);
router.put("/:id", auth, multer, postsCtrl.updatePost);
router.delete("/:id", auth, postsCtrl.deletePost);

module.exports = router;
