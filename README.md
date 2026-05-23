# UR-MESSAGE - Real-Time Messaging App Backend

A production-ready, scalable backend for a real-time mobile messaging application built with Node.js, Express, MongoDB, and Socket.IO.

## 🌟 Features

### ✅ Authentication System
- User signup with email, username, and password
- Secure login with JWT tokens
- Profile picture upload to Cloudinary
- Password hashing with bcrypt
- Token-based authentication

### ✅ User Management
- Search users by username or email
- View user profiles
- Add/remove friends
- Online/offline status tracking
- Last seen timestamp
- Block/unblock users (model ready)

### ✅ Real-Time Messaging
- One-to-one direct messaging
- Auto-create chats between users
- Send text messages
- Send images with URL references
- Send emojis
- Message read receipts
- Typing indicators
- Message deletion

### ✅ Socket.IO Events
- `user_connected` - User comes online
- `user_disconnected` - User goes offline
- `send_message` - Send a new message
- `receive_message` - Receive incoming messages
- `typing` - Show typing indicator
- `stop_typing` - Hide typing indicator
- `message_read` - Mark message as read
- `user_status_changed` - Status change notifications

### ✅ Security Features
- Password hashing with bcrypt
- JWT authentication middleware
- Input validation
- CORS configuration
- Protected routes
- Environment variable management

## 📁 Project Structure

```
ur-message-backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Environment configuration
│   │   ├── database.js         # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary setup
│   ├── models/
│   │   ├── User.js             # User schema & methods
│   │   ├── Chat.js             # Chat schema
│   │   └── Message.js          # Message schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic (signup, login)
│   │   ├── userController.js   # User logic (search, friends)
│   │   └── messageController.js # Messaging logic
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── userRoutes.js       # User endpoints
│   │   └── messageRoutes.js    # Messaging endpoints
│   ├── middleware/
│   │   ├── authenticate.js     # JWT verification
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validators.js       # Input validation
│   ├── sockets/
│   │   └── socketHandler.js    # Socket.IO events
│   ├── services/               # Business logic (optional)
│   ├── utils/
│   │   ├── logger.js           # Logging utility
│   │   └── responseHandler.js  # Response formatting
│   └── server.js               # Main application file
├── package.json
├── .env.example
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd ur-message-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ur-message
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

4. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Sign Up
```
POST /auth/signup
Content-Type: multipart/form-data

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "profilePicture": <file>
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ...user data },
    "token": "jwt_token"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ...user data },
    "token": "jwt_token"
  }
}
```

#### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ...user profile }
}
```

#### Update Profile
```
PUT /auth/profile
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "bio": "Hello! I'm using UR-Message",
  "profilePicture": <file> (optional)
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated user }
}
```

### User Endpoints

#### Search Users
```
GET /users/search?query=john
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "profilePicture": "url",
      "status": "online"
    },
    ...
  ]
}
```

#### Get User Profile
```
GET /users/:userId
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ...user profile }
}
```

#### Get Friends List
```
GET /users/friends/list/all
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 10,
  "data": [ ...friends ]
}
```

#### Add Friend
```
POST /users/friends/add
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "user_id"
}

Response:
{
  "success": true,
  "message": "Friend added successfully",
  "data": { ...updated user }
}
```

#### Remove Friend
```
DELETE /users/friends/:friendId
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Friend removed successfully",
  "data": { ...updated user }
}
```

#### Update Status
```
PUT /users/status
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "online|offline|away"
}

Response:
{
  "success": true,
  "data": { ...user with updated status }
}
```

### Messaging Endpoints

#### Get Chats
```
GET /messages
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "chat_id",
      "participants": [ ...users ],
      "lastMessage": { ...message },
      "lastMessageTime": "2026-05-23T10:00:00Z",
      "createdAt": "2026-05-23T09:00:00Z"
    },
    ...
  ]
}
```

#### Get Messages in Chat
```
GET /messages/:chatId/messages?page=1&limit=50
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 50,
  "total": 150,
  "page": 1,
  "pages": 3,
  "data": [ ...messages ]
}
```

#### Send Message
```
POST /messages/send
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user_id",
  "content": "Hello!",
  "messageType": "text|image|emoji",
  "imageUrl": "https://..." (if messageType is image)
}

Response:
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": { ...message data },
    "chatId": "chat_id"
  }
}
```

#### Mark Message as Read
```
PUT /messages/:messageId/read
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Message marked as read",
  "data": { ...message }
}
```

#### Delete Message
```
DELETE /messages/:messageId
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

## 🔌 Socket.IO Events

### Client to Server

#### send_message
```javascript
socket.emit('send_message', {
  recipientId: 'user_id',
  content: 'Hello!',
  messageType: 'text|image|emoji',
  imageUrl: 'https://...' // if image
});
```

#### typing
```javascript
socket.emit('typing', {
  recipientId: 'user_id'
});
```

#### stop_typing
```javascript
socket.emit('stop_typing', {
  recipientId: 'user_id'
});
```

#### message_read
```javascript
socket.emit('message_read', {
  messageId: 'msg_id',
  recipientId: 'user_id'
});
```

#### update_status
```javascript
socket.emit('update_status', {
  status: 'online|offline|away'
});
```

### Server to Client

#### receive_message
```javascript
socket.on('receive_message', (data) => {
  // {
  //   message: { ...message data },
  //   chatId: 'chat_id',
  //   sender: { id, username, profilePicture }
  // }
});
```

#### user_typing
```javascript
socket.on('user_typing', (data) => {
  // { userId, username }
});
```

#### user_stopped_typing
```javascript
socket.on('user_stopped_typing', (data) => {
  // { userId }
});
```

#### message_read_receipt
```javascript
socket.on('message_read_receipt', (data) => {
  // { messageId, readAt }
});
```

#### user_connected
```javascript
socket.on('user_connected', (data) => {
  // { userId, status, username, profilePicture }
});
```

#### user_disconnected
```javascript
socket.on('user_disconnected', (data) => {
  // { userId, status }
});
```

#### user_status_changed
```javascript
socket.on('user_status_changed', (data) => {
  // { userId, status }
});
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` file, always use `.env.example`
2. **Password Hashing**: All passwords are hashed with bcrypt before storing
3. **JWT Tokens**: Tokens are signed and verified for every protected route
4. **CORS**: Configured to accept requests only from allowed origin
5. **Input Validation**: All user inputs are validated before processing
6. **Error Handling**: Sensitive error details are hidden in production
7. **Rate Limiting**: Consider adding rate limiting in production (using express-rate-limit)

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "details": "Additional details (if available)"
}
```

HTTP Status Codes:
- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Access denied
- `404`: Not Found - Resource not found
- `500`: Internal Server Error

## 📈 Database Schemas

### User Schema
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique),
  password: String (hashed),
  profilePicture: String (Cloudinary URL),
  bio: String (0-160 chars),
  status: String (online|offline|away),
  lastSeen: Date,
  friends: [ObjectId],
  blockedUsers: [ObjectId],
  timestamps: true
}
```

### Chat Schema
```javascript
{
  participants: [ObjectId], // 2 users
  lastMessage: ObjectId,
  lastMessageTime: Date,
  isActive: Boolean,
  timestamps: true
}
```

### Message Schema
```javascript
{
  chat: ObjectId,
  sender: ObjectId,
  content: String,
  messageType: String (text|image|emoji),
  imageUrl: String,
  isRead: Boolean,
  readAt: Date,
  replyTo: ObjectId,
  timestamps: true
}
```

## 🔄 Database Indexes

For optimal performance, the following indexes are created:

- `User`: username, email
- `Chat`: participants (compound)
- `Message`: chat + createdAt (compound), sender

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File upload handling
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

## 📝 Future Enhancements

- [ ] Group chats
- [ ] Message reactions (emojis)
- [ ] Voice/video calls
- [ ] Message search
- [ ] Message forwarding
- [ ] User presence (last seen)
- [ ] Message encryption
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] Notification system
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support, email support@ur-message.com or open an issue on GitHub.

---

**Built with ❤️ by the UR-Message Team**
