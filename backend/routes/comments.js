const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const commentsCtrl = require("../controllers/comments");

router.post("/:postId/comments", auth, commentsCtrl.createComment);
router.get("/comments/all", auth, commentsCtrl.getAllComments);
router.put("/:postid/comments/:id", auth, commentsCtrl.updateComment);
router.delete("/:postid/comments/:id", auth, commentsCtrl.deleteComment);

module.exports = router;
