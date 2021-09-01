const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const likesCtrl = require("../controllers/likes");

router.post("/:postId/like", auth, likesCtrl.createLikes);
router.get("/like/all", auth, likesCtrl.getLikes);

module.exports = router;
