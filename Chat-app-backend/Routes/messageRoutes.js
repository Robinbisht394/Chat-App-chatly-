const express = require("express");
const { route } = require("./UserRoutes");
const { authMiddleware } = require("../MiddleWare/authMiddleware");
const {
  sendMessage,
  getAllMessage,
} = require("../Controller/messageController");

const router = express.Router();

route.post("/", authMiddleware, sendMessage);
route.get("/", authMiddleware, getAllMessage);

module.exports = router;
