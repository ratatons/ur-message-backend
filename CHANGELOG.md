# CHANGELOG - Version History

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- [ ] Group chats
- [ ] Message reactions (emoji reactions)
- [ ] Voice/video call integration
- [ ] Message search functionality
- [ ] Two-factor authentication
- [ ] User presence indicators (typing, online)
- [ ] Message encryption
- [ ] Rate limiting middleware
- [ ] Notification system (email, push)
- [ ] Analytics dashboard

## [1.0.0] - 2026-05-23

### Added
- Initial release of UR-Message Backend
- **Authentication System**
  - User signup with email, username, password
  - Secure login with JWT token generation
  - Password hashing with bcrypt
  - Profile picture upload to Cloudinary
  - User profile update functionality
  - Current user profile retrieval

- **User Management**
  - Search users by username or email
  - View user profiles
  - Add friends (bidirectional)
  - Remove friends (bidirectional)
  - Get friends list with details
  - Online/offline status tracking
  - Last seen timestamp
  - User bio functionality

- **Real-Time Messaging**
  - One-to-one direct messaging
  - Automatic chat creation between users
  - Send text messages
  - Send images with URL references
  - Send emoji messages
  - Message read receipts
  - Mark messages as read
  - Delete messages
  - Message pagination

- **Socket.IO Real-Time Events**
  - `user_connected` - User comes online
  - `user_disconnected` - User goes offline
  - `send_message` - Send new message in real-time
  - `receive_message` - Receive incoming messages
  - `typing` - Show typing indicator
  - `stop_typing` - Hide typing indicator
  - `message_read` - Message read receipt
  - `user_status_changed` - Status change notifications
  - `message_read_receipt` - Send read confirmation

- **Security Features**
  - JWT authentication middleware
  - Password hashing with bcrypt
  - Input validation middleware
  - CORS configuration
  - Protected API routes
  - Error handling middleware
  - Environment variable management

- **Database Models**
  - User schema with validation
  - Chat schema for conversations
  - Message schema with timestamps
  - Proper indexing for performance
  - Relationship management

- **API Endpoints (15 total)**
  - POST `/auth/signup` - Register new user
  - POST `/auth/login` - User login
  - GET `/auth/me` - Get current user
  - PUT `/auth/profile` - Update profile
  - GET `/users/search` - Search users
  - GET `/users/:userId` - Get user profile
  - GET `/users/friends/list/all` - Get friends list
  - POST `/users/friends/add` - Add friend
  - DELETE `/users/friends/:friendId` - Remove friend
  - PUT `/users/status` - Update status
  - GET `/messages` - Get all chats
  - GET `/messages/:chatId/messages` - Get chat messages
  - POST `/messages/send` - Send message
  - PUT `/messages/:messageId/read` - Mark as read
  - DELETE `/messages/:messageId` - Delete message

- **Documentation**
  - Comprehensive README.md
  - API testing guide
  - Architecture documentation
  - Deployment guide
  - Quick start guide
  - Contributing guidelines
  - This changelog

- **Development Tools**
  - Environment configuration
  - Logger utility
  - Response handler utility
  - Error handling system
  - Validation middleware

### Project Structure
```
src/
├── config/           - Configuration files
├── controllers/      - Business logic
├── models/          - Database schemas
├── routes/          - API endpoints
├── middleware/      - Express middleware
├── sockets/         - Real-time events
├── utils/           - Helper functions
└── server.js        - Main application
```

### Technology Stack
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing
- Cloudinary for image hosting
- Multer for file uploads
- CORS for cross-origin requests
- dotenv for environment variables

### Configuration
- Port: 5000 (configurable)
- MongoDB Atlas support
- Cloudinary integration
- JWT token expiration: 7 days
- CORS enabled for specified origins
- Bcrypt salt rounds: 10

### Known Limitations
- Single server instance (no horizontal scaling)
- In-memory user tracking (not persistent across servers)
- No message encryption
- No end-to-end encryption
- Basic error messages in development
- No rate limiting implemented

### Future Improvements
- [ ] Implement Redis for session management
- [ ] Add message encryption
- [ ] Implement rate limiting
- [ ] Add comprehensive logging
- [ ] Database query optimization
- [ ] Performance monitoring
- [ ] Analytics tracking
- [ ] API versioning
- [ ] GraphQL support
- [ ] Mobile app optimization

---

## Version Guidelines

**MAJOR version** when you make incompatible API changes
**MINOR version** when you add functionality in a backward compatible manner
**PATCH version** when you make backward compatible bug fixes

### Example Version Format
- `1.0.0` - Initial release
- `1.0.1` - Bug fix
- `1.1.0` - New feature
- `2.0.0` - Breaking change

---

## How to Update

### For Users
1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Test application: `npm run dev`

### For Contributors
1. Check CHANGELOG before updating
2. Review breaking changes
3. Update configuration if needed
4. Run tests to verify compatibility

---

**Last Updated**: May 23, 2026
**Current Version**: 1.0.0
**Status**: ✅ Production Ready
