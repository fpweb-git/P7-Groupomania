const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const idCheck = require("../middleware/idCheck");

router.post("/post", auth, multer.posts, postCtrl.createPost);
router.get("/post", auth, postCtrl.getAllPosts);
router.get("/post/:id", auth, postCtrl.getOnePost);
router.get("/post/users/:id", auth, postCtrl.getAllPostsOfOneUser);
router.delete("/post/:id", auth, idCheck.posts, postCtrl.deletePost);
router.put("/post/:id", auth, idCheck.posts, postCtrl.modifyPost);

module.exports = router;