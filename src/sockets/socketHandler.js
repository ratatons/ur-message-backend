const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const { getOrCreateChat } = require('../controllers/messageController');
const Message = require('../models/Message');

// Store active users: { userId: socketId }
const activeUsers = new Map();

/**
 * Socket.IO Event Handlers
 * Manages real-time communication
 */
const initializeSocket = (io) => {
  // Middleware to authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.userId = decoded.userId;

      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (Socket: ${socket.id})`);

    // Store active user
    activeUsers.set(socket.userId, socket.id);

    // Emit user connected
    socket.broadcast.emit('user_connected', {
      userId: socket.userId,
      status: 'online',
      username: socket.user.username,
      profilePicture: socket.user.profilePicture,
    });

    // Join personal room
    socket.join(`user_${socket.userId}`);

    // ============ REAL-TIME MESSAGE EVENTS ============

    /**
     * Send Message Event
     * @event send_message
     */
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, messageType = 'text', imageUrl } = data;

        if (!recipientId || !content) {
          return socket.emit('error', {
            message: 'Invalid message data',
          });
        }

        // Create and save message
        const chat = await getOrCreateChat(socket.userId, recipientId);
        const message = new Message({
          chat: chat._id,
          sender: socket.userId,
          content,
          messageType,
          imageUrl: messageType === 'image' ? imageUrl : null,
        });

        await message.save();
        await message.populate('sender', 'username profilePicture');

        // Update chat
        chat.lastMessage = message._id;
        chat.lastMessageTime = new Date();
        await chat.save();

        // Emit to recipient
        const recipientSocketId = activeUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receive_message', {
            message,
            chatId: chat._id,
            sender: {
              id: socket.userId,
              username: socket.user.username,
              profilePicture: socket.user.profilePicture,
            },
          });
        }

        // Confirm to sender
        socket.emit('message_sent', {
          message,
          chatId: chat._id,
        });

        console.log(`📨 Message sent from ${socket.userId} to ${recipientId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', {
          message: error.message,
        });
      }
    });

    /**
     * Typing Event
     * @event typing
     */
    socket.on('typing', (data) => {
      const { recipientId } = data;

      const recipientSocketId = activeUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_typing', {
          userId: socket.userId,
          username: socket.user.username,
        });
      }
    });

    /**
     * Stop Typing Event
     * @event stop_typing
     */
    socket.on('stop_typing', (data) => {
      const { recipientId } = data;

      const recipientSocketId = activeUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('user_stopped_typing', {
          userId: socket.userId,
        });
      }
    });

    /**
     * Mark Message as Read
     * @event message_read
     */
    socket.on('message_read', async (data) => {
      try {
        const { messageId, recipientId } = data;

        const message = await Message.findByIdAndUpdate(
          messageId,
          {
            isRead: true,
            readAt: new Date(),
          },
          { new: true }
        );

        // Notify sender
        const senderSocketId = activeUsers.get(recipientId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read_receipt', {
            messageId,
            readAt: message.readAt,
          });
        }
      } catch (error) {
        console.error('Mark message as read error:', error);
      }
    });

    /**
     * Update User Status
     * @event update_status
     */
    socket.on('update_status', async (data) => {
      try {
        const { status } = data;

        if (!['online', 'offline', 'away'].includes(status)) {
          return socket.emit('error', {
            message: 'Invalid status',
          });
        }

        await User.findByIdAndUpdate(
          socket.userId,
          { status, lastSeen: new Date() }
        );

        // Broadcast status change
        socket.broadcast.emit('user_status_changed', {
          userId: socket.userId,
          status,
        });

        console.log(`📍 User ${socket.userId} status: ${status}`);
      } catch (error) {
        console.error('Update status error:', error);
      }
    });

    /**
     * Disconnect Event
     */
    socket.on('disconnect', async () => {
      try {
        // Remove user from active users
        activeUsers.delete(socket.userId);

        // Update user status
        await User.findByIdAndUpdate(
          socket.userId,
          { status: 'offline', lastSeen: new Date() }
        );

        // Emit user disconnected
        socket.broadcast.emit('user_disconnected', {
          userId: socket.userId,
          status: 'offline',
        });

        console.log(`❌ User disconnected: ${socket.userId}`);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });

    // ============ ERROR HANDLING ============

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

/**
 * Get Active Users
 */
const getActiveUsers = () => {
  return Array.from(activeUsers.keys());
};

module.exports = {
  initializeSocket,
  getActiveUsers,
  activeUsers,
};
