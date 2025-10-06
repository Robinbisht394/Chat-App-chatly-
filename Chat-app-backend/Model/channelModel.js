const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    unique: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPrivate: { type: Boolean, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const ChannelModel = mongoose.model("Channel", ChannelSchema);

module.exports = { ChannelModel };
