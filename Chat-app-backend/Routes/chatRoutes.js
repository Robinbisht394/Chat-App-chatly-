const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../MiddleWare/authMiddleware");
const {
  accessChat,
  fetchAllchats,
  createGroupChat,
  renameGroup,
  dropUserFromGroup,
  addUserToGroup,
} = require("../Controller/chatController");

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchAllchats);
router.route("/groupchat").post(createGroupChat);
router.route("/renamegroupchat").put(renameGroup);
router.route("/dropuser").put(dropUserFromGroup);
router.route("/adduser").put(addUserToGroup);

module.exports = router;
