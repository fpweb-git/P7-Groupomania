const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comment");
const auth = require("../middleware/auth");
const idCheck = require("../middleware/idCheck");

router.post("/post/:id/comment", auth, commentCtrl.createComment);
router.get("/post/:id/comment", auth, commentCtrl.getAllComments);
router.get("/post/:id/comment/:id", auth, commentCtrl.getOneComment);
router.delete("/post/:id/comment/:id", auth, idCheck.comments, commentCtrl.deleteComment);
router.put("/post/:id/commment/:id", auth, idCheck.comments, commentCtrl.modifyComment);

module.exports = router;