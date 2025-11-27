// MongoDB Message model (optional - app works without MongoDB)
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  room: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String },
  file: {
    name: String,
    type: String,
    data: String,
  },
  timestamp: { type: Date, required: true, index: true },
  readBy: [{ type: String }],
  isPrivate: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Index for efficient queries
messageSchema.index({ room: 1, timestamp: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;


