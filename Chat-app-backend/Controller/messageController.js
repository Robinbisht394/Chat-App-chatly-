const chatModel = require("../Model/chatModel");
const messageModel = require("../Model/messageModel");

const sendMessage = async (req, res) => {
  const { content, chatID } = req.body;
  if (!content || !chatID) return res.status(400);
  try {
    let message = await messageModel({
      sender: req.user._id,
      content: content,
      chat: chatID,
    });
    message = message.populate("sender", "name email pic").populate("chat");

    await chatModel.findByIdAndUpdate(chatID, { lastestMessage: message });

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};
const getAllMessage = async (req, res) => {
  const { chatId } = req.body;

  try {
    const message = await message
      .find(chatId)
      .populate("sender", "name email pic")
      .populate("chat")
      .sort({ createdAt: 1 });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { sendMessage, getAllMessage };
