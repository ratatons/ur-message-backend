const mongoose = require('mongoose');

/**
 * Chat Schema
 * Represents one-to-one conversations between two users
 */
const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Ensure unique chat between two participants
 */
chatSchema.index({ participants: 1 });

/**
 * Create compound index for unique conversations
 * This ensures only one chat can exist between two specific users
 */
chatSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  // Sort participants to ensure consistency
  this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));

  // Check if chat already exists
  const existingChat = await mongoose.model('Chat').findOne({
    participants: { $all: this.participants },
  });

  if (existingChat) {
    return next(new Error('Chat already exists between these participants'));
  }

  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
