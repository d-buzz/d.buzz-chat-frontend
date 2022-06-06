const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  fromAccount: {
    type: String,
    required: true,
  },
  toAccount: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  fromPubKey: {
    type: String,
    required: true,
  },
  toPubKey: {
    type: String,
    required: true,
  },
  transaction: {
    type: String,
    required: true,
  },
});

module.exports = Message = mongoose.model("message", MessageSchema);
