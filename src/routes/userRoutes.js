const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const { validateSearch } = require('../middleware/validators');

const router = express.Router();

/**
 * @route GET /users/search
 * @desc Search users by username or email
 * @access Private
 */
router.get('/search', authenticate, validateSearch, userController.searchUsers);

/**
 * @route GET /users/:userId
 * @desc Get user profile by ID
 * @access Private
 */
router.get('/:userId', authenticate, userController.getUserProfile);

/**
 * @route PUT /users/status
 * @desc Update user online status
 * @access Private
 */
router.put('/status', authenticate, userController.updateStatus);

/**
 * @route GET /friends
 * @desc Get current user's friends list
 * @access Private
 */
router.get('/friends/list/all', authenticate, userController.getFriends);

/**
 * @route POST /friends/add
 * @desc Add a friend
 * @access Private
 */
router.post('/friends/add', authenticate, userController.addFriend);

/**
 * @route DELETE /friends/:friendId
 * @desc Remove a friend
 * @access Private
 */
router.delete('/friends/:friendId', authenticate, userController.removeFriend);

module.exports = router;
