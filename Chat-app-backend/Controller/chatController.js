const chatModel = require("../Model/chatModel");
const userModel = require("../Model/UserModel");

// create or access chat 1-1
const accessChat = async (req, res) => {
  const userId = req.body;
  const isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    })

    .populate("User", select("-password"))
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  console.log("Access chat exist", isChat);

  let chatData;
  // if chat exist then send it otherwise create newone
  if (isChat.length > 0) {
    return res
      .status(200)
      .json({ success: true, status: "success", chat: isChat[0] });
  } else {
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await chatModel.create(chatData);
    const fullchat = await chatModel
      .find({ _id: createdChat._id })
      .populate("User", "-password");
    return res.status(200).json({ chat: fullchat });
  } catch (error) {
    console.log({ api: "Access chat", error: err.message });
    return res.status(500).json({
      success: false,
      status: "failed",
      message: "Something  went wrong try again",
    });
  }
};

//  fetch all chats for user
const fetchAllchats = async (req, res) => {
  const userId = req.user._id;
  try {
    const chats = chatModel.find({ user: { $elemMatch: { $eq: userId } } });
    chats
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });
    return res
      .status(200)
      .json({ success: true, status: "success", chats: chats });
  } catch (err) {
    console.log({ api: "fetch chats", error: err.message });

    return res
      .status(500)
      .json({ success: false, status: "success", error: err.message });
  }
};

// cretae a group chat
const createGroupChat = async (req, res) => {
  const userId = req.user._id;
  if (!req.body.users)
    return res.status(400).json({
      status: "Error",
      code: "USERS_NOT_PROVIDED",
      message: "Users not provided",
    });
  // parse the users
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      status: "Error",
      code: "USER_ERROR",
      message: "Users should be more than two",
    });
  }
  users.push(req.user);
  try {
    const groupchat = await chatModel.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    if (!groupchat) throw new Error("Something went wrong");

    const fullGroupChat = await groupchat
      .findOne({ _id: groupchat._id })
      .popuate("users", "-password")
      .popuate("groupAdmin", "-password");

    res.status(200).json({ groupchat: fullGroupChat });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
// rename a chat
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatName)
    return res.status(400).json({
      success: false,
      status: "Failed",
      message: "New group name is required",
    });
  try {
    const groupchat = await chatModel.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    );
    if (!groupchat) {
      return res
        .status(400)
        .json({ success: false, status: "Failed", message: "Chat Not found" });
    } else {
      return res.status(200).json(groupchat);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      status: "failed",
      message: "Something went wrong try again !",
    });
  }
};
// drop user
const dropUserFromGroup = async (req, res) => {
  const { chatId, dropUserId } = req.body;
  try {
    const groupchat = await chatModel
      .updateOne(
        { _id: chatId },
        { $pull: { user: dropUserId } },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!groupchat)
      return res
        .status(400)
        .json({ success: false, status: "Failed", message: "Chat not found" });
    return res.status(200).json(groupchat);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, status: "Failed", error: err.message });
  }
};
// add user
const addUserToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const groupChat = await chatModel
      .findByIdAndUpdate({ chatId }, { $push: { user: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (groupChat)
      return res
        .status(404)
        .json({ success: false, status: "Failed", message: "Chat not found" });
    return res.status(200).json(groupChat);
  } catch (err) {
    console.log(err, "add user group");
    return res
      .staus(200)
      .json({
        success: false,
        status: "Failed",
        error: "Something went wrong try again !",
      });
  }
};

module.exports = {
  accessChat,
  fetchAllchats,
  createGroupChat,
  dropUserFromGroup,
  addUserToGroup,
  renameGroup,
};
