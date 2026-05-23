const User = require('../models/User');

/**
 * Search Users by Username
 * @route GET /users/search
 */
const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const currentUserId = req.userId;

    // Search for users matching the query
    const users = await User.find(
      {
        $and: [
          {
            $or: [
              { username: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
          { _id: { $ne: currentUserId } }, // Exclude current user
          { _id: { $nin: req.user.blockedUsers } }, // Exclude blocked users
        ],
      },
      'username email profilePicture status'
    )
      .limit(20)
      .exec();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Profile by ID
 * @route GET /users/:userId
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId, 'username email profilePicture bio status lastSeen friends');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add Friend
 * @route POST /friends/add
 */
const addFriend = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const userId = req.userId;

    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: 'Friend ID is required',
      });
    }

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add yourself as a friend',
      });
    }

    // Find current user
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Friend not found',
      });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'Already friends',
      });
    }

    // Check if user is blocked
    if (user.blockedUsers.includes(friendId) || friend.blockedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add this user',
      });
    }

    // Add friend (bidirectional)
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({
      success: true,
      message: 'Friend added successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove Friend
 * @route DELETE /friends/:friendId
 */
const removeFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    // Find users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'Friend not found',
      });
    }

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'Not friends with this user',
      });
    }

    // Remove friend (bidirectional)
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Friends List
 * @route GET /friends
 */
const getFriends = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      'friends',
      'username email profilePicture status lastSeen'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.friends.length,
      data: user.friends,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Status
 * @route PUT /users/status
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const userId = req.userId;

    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status, lastSeen: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  addFriend,
  removeFriend,
  getFriends,
  updateStatus,
};
