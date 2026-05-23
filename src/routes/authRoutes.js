const express = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { validateSignup, validateLogin } = require('../middleware/validators');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * @route POST /auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', upload.single('profilePicture'), validateSignup, authController.signup);

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route GET /auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route PUT /auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, upload.single('profilePicture'), authController.updateProfile);

module.exports = router;
