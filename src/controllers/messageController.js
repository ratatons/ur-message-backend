const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * Get or Create Chat between two users
 * Helper function
 */
const getOrCreateChat = async (userId, recipientId) => {
  // Sort IDs to maintain consistency
  const [participant1, participant2] = [userId, recipientId].sort();

  let chat = await Chat.findOne({
    participants: { $all: [participant1, participant2] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [participant1, participant2],
    });
  }

  return chat;
};

/**
 * Get All Chats for Current User
 * @route GET /chats
 */
const getChats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username profilePicture status lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Messages from a Chat
 * @route GET /chats/:chatId/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.userId;

    // Check if user is participant
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this chat',
      });
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get messages with pagination
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: chatId });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send Message
 * @route POST /messages/send
 */
const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, messageType = 'text', imageUrl } = req.body;
    const userId = req.userId;

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message content are required',
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Get or create chat
    const chat = await getOrCreateChat(userId, recipientId);

    // Create message
    const message = new Message({
      chat: chat._id,
      sender: userId,
      content,
      messageType,
      imageUrl: messageType === 'image' ? imageUrl : null,
    });

    await message.save();
    await message.populate('sender', 'username profilePicture');

    // Update chat with last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
        chatId: chat._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Message as Read
 * @route PUT /messages/:messageId/read
 */
const markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Verify user is recipient
    const chat = await Chat.findById(message.chat);
    if (!chat.participants.includes(userId) || message.sender.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Message
 * @route DELETE /messages/:messageId
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages',
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  getMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  getOrCreateChat,
};
