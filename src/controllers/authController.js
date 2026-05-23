const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

/**
 * Sign Up Controller
 * @route POST /auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username',
      });
    }

    // Handle profile picture upload
    let profilePictureUrl = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ur-message/profile-pictures',
          resource_type: 'auto',
        });
        profilePictureUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profilePicture: profilePictureUrl,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userProfile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login Controller
 * @route POST /auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userProfile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Profile
 * @route GET /auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'username profilePicture status');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 * @route PUT /auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update bio if provided
    if (bio !== undefined) {
      user.bio = bio;
    }

    // Handle profile picture update
    if (req.file) {
      try {
        // Delete old image if exists
        if (user.profilePicture) {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`ur-message/profile-pictures/${publicId}`);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ur-message/profile-pictures',
          resource_type: 'auto',
        });
        user.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  updateProfile,
};
