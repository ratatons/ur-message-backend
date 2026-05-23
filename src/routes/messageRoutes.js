const express = require('express');
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

/**
 * @route GET /chats
 * @desc Get all chats for current user
 * @access Private
 */
router.get('/', authenticate, messageController.getChats);

/**
 * @route GET /chats/:chatId/messages
 * @desc Get all messages in a chat with pagination
 * @access Private
 */
router.get('/:chatId/messages', authenticate, messageController.getMessages);

/**
 * @route POST /messages/send
 * @desc Send a new message
 * @access Private
 */
router.post('/send', authenticate, messageController.sendMessage);

/**
 * @route PUT /messages/:messageId/read
 * @desc Mark message as read
 * @access Private
 */
router.put('/:messageId/read', authenticate, messageController.markMessageAsRead);

/**
 * @route DELETE /messages/:messageId
 * @desc Delete a message
 * @access Private
 */
router.delete('/:messageId', authenticate, messageController.deleteMessage);

module.exports = router;
