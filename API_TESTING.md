# API Testing Guide

This file contains example requests for testing the UR-Message API.

## Postman Collection (Quick Setup)

You can import these requests into Postman for testing.

### 1. Sign Up

```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id_here",
      "username": "john_doe",
      "email": "john@example.com",
      "bio": "",
      "status": "offline",
      "friends": [],
      "blockedUsers": [],
      "createdAt": "2026-05-23T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ...user data },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile

```
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "data": { ...user data with friends }
}
```

### 4. Update Profile

```
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "I love UR-Message! 🚀"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated user }
}
```

### 5. Search Users

```
GET http://localhost:5000/api/users/search?query=john
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "profilePicture": "https://...",
      "status": "online"
    },
    ...
  ]
}
```

### 6. Add Friend

```
POST http://localhost:5000/api/users/friends/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "friendId": "friend_user_id_here"
}

Response:
{
  "success": true,
  "message": "Friend added successfully",
  "data": { ...updated user with new friend }
}
```

### 7. Get Friends List

```
GET http://localhost:5000/api/users/friends/list/all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "friend_id",
      "username": "friend_name",
      "email": "friend@example.com",
      "profilePicture": "https://...",
      "status": "online",
      "lastSeen": "2026-05-23T09:30:00Z"
    },
    ...
  ]
}
```

### 8. Get All Chats

```
GET http://localhost:5000/api/messages
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "chat_id",
      "participants": [ ...user objects ],
      "lastMessage": { ...message object },
      "lastMessageTime": "2026-05-23T10:15:00Z"
    },
    ...
  ]
}
```

### 9. Get Messages from Chat

```
GET http://localhost:5000/api/messages/chat_id_here/messages?page=1&limit=50
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 50,
  "total": 150,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "msg_id",
      "chat": "chat_id",
      "sender": { ...user info },
      "content": "Hello!",
      "messageType": "text",
      "isRead": true,
      "readAt": "2026-05-23T10:16:00Z",
      "createdAt": "2026-05-23T10:15:00Z"
    },
    ...
  ]
}
```

### 10. Send Message

```
POST http://localhost:5000/api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "recipient_user_id",
  "content": "Hey! How are you?",
  "messageType": "text"
}

Response:
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "_id": "msg_id",
      "chat": "chat_id",
      "sender": { ...sender info },
      "content": "Hey! How are you?",
      "messageType": "text",
      "isRead": false,
      "createdAt": "2026-05-23T10:20:00Z"
    },
    "chatId": "chat_id"
  }
}
```

### 11. Send Image Message

```
POST http://localhost:5000/api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "recipient_user_id",
  "content": "Check this out!",
  "messageType": "image",
  "imageUrl": "https://cloudinary.com/path/to/image.jpg"
}
```

### 12. Send Emoji Message

```
POST http://localhost:5000/api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "recipient_user_id",
  "content": "😂",
  "messageType": "emoji"
}
```

### 13. Mark Message as Read

```
PUT http://localhost:5000/api/messages/msg_id_here/read
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Message marked as read",
  "data": { ...message with isRead: true }
}
```

### 14. Delete Message

```
DELETE http://localhost:5000/api/messages/msg_id_here
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### 15. Update User Status

```
PUT http://localhost:5000/api/users/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "online"
}

Response:
{
  "success": true,
  "data": { ...user with updated status }
}
```

## Socket.IO Events (WebSocket)

### Connect with Token

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### Send Message (Real-time)

```javascript
socket.emit('send_message', {
  recipientId: 'recipient_user_id',
  content: 'Hello from Socket.IO!',
  messageType: 'text'
});
```

### Receive Message (Real-time)

```javascript
socket.on('receive_message', (data) => {
  console.log('New message:', data.message);
  console.log('From:', data.sender.username);
});
```

### Show Typing Indicator

```javascript
socket.emit('typing', {
  recipientId: 'recipient_user_id'
});

// Listen for typing
socket.on('user_typing', (data) => {
  console.log(`${data.username} is typing...`);
});
```

### Stop Typing

```javascript
socket.emit('stop_typing', {
  recipientId: 'recipient_user_id'
});

// Listen for stop typing
socket.on('user_stopped_typing', (data) => {
  console.log(`${data.userId} stopped typing`);
});
```

### Mark Message as Read (Real-time)

```javascript
socket.emit('message_read', {
  messageId: 'msg_id',
  recipientId: 'recipient_user_id'
});

// Sender receives read receipt
socket.on('message_read_receipt', (data) => {
  console.log(`Message read at: ${data.readAt}`);
});
```

### Update User Status

```javascript
socket.emit('update_status', {
  status: 'away'
});

// Others see status change
socket.on('user_status_changed', (data) => {
  console.log(`${data.userId} is now ${data.status}`);
});
```

### User Connected

```javascript
socket.on('user_connected', (data) => {
  console.log(`${data.username} is now online`);
});
```

### User Disconnected

```javascript
socket.on('user_disconnected', (data) => {
  console.log(`${data.userId} is now offline`);
});
```

## cURL Examples

### Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Users

```bash
curl -X GET "http://localhost:5000/api/users/search?query=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Friend

```bash
curl -X POST http://localhost:5000/api/users/friends/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "friendId": "friend_user_id"
  }'
```

### Send Message

```bash
curl -X POST http://localhost:5000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "recipientId": "recipient_user_id",
    "content": "Hello!",
    "messageType": "text"
  }'
```

## Environment Variables for Testing

Create a `.env.test` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ur-message-test
JWT_SECRET=test_secret_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=test_cloud
CLOUDINARY_API_KEY=test_api_key
CLOUDINARY_API_SECRET=test_api_secret
CLIENT_URL=http://localhost:3000
```

## Common Error Responses

### 401 Unauthorized (Missing Token)
```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

### 400 Bad Request (Invalid Input)
```json
{
  "success": false,
  "message": "Validation Error",
  "details": "Username must be at least 3 characters, Password must be at least 6 characters"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

**Happy Testing! 🚀**
