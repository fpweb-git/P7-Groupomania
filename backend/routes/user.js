const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const idCheck = require("../middleware/idCheck");
const onlyfile = require("../middleware/onlyFile");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/users", userCtrl.getAllUsers);
router.get("/users/:id", userCtrl.getOneUser);
router.delete("/users/:id", auth, idCheck.users, userCtrl.deleteUser);
router.put("/users/:id/username", auth, idCheck.users, userCtrl.modifyUserUsername);
router.put("/users/:id/email", auth, idCheck.users, userCtrl.modifyUserEmail);
router.put("/users/:id/password", auth, idCheck.users, userCtrl.modifyUserPassword);
router.put("/users/pic/:id", auth, idCheck.users, onlyfile, multer.users, userCtrl.ModifyUserPic);

module.exports = router;
