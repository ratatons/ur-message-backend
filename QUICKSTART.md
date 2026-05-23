# QUICKSTART.md - 5-Minute Setup Guide

## ⚡ Start in 5 Minutes

### 1. Prerequisites
- Node.js 14+ installed
- MongoDB running locally (or MongoDB Atlas account)
- Git

### 2. Clone & Setup

```bash
# Clone repository
git clone <repo-url>
cd ur-message-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Configure .env

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ur-message
JWT_SECRET=your_secret_key_here_min_32_chars
CLOUDINARY_CLOUD_NAME=test
CLOUDINARY_API_KEY=test
CLOUDINARY_API_SECRET=test
CLIENT_URL=http://localhost:3000
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Expected output:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
ℹ️  Environment: development
🔗 CORS enabled for: http://localhost:3000
💾 MongoDB: mongodb://localhost:27017/ur-message
```

### 5. Test the API

```bash
# Check if server is running
curl http://localhost:5000/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-23T10:00:00.000Z"
}
```

## 🎯 Common Commands

```bash
# Install packages
npm install

# Start dev server
npm run dev

# Start production server
npm start

# Update packages
npm update

# Check security vulnerabilities
npm audit
npm audit fix
```

## 📁 Project Files Overview

```
src/
├── server.js              ← Main entry point
├── config/
│   ├── config.js          ← Environment variables
│   ├── database.js        ← MongoDB connection
│   └── cloudinary.js      ← Image upload config
├── models/                ← Database schemas
│   ├── User.js
│   ├── Chat.js
│   └── Message.js
├── controllers/           ← Business logic
│   ├── authController.js
│   ├── userController.js
│   └── messageController.js
├── routes/                ← API endpoints
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── messageRoutes.js
├── middleware/            ← Express middleware
│   ├── authenticate.js    ← JWT verification
│   ├── errorHandler.js
│   └── validators.js
├── sockets/               ← Real-time events
│   └── socketHandler.js
└── utils/                 ← Helper functions
    ├── logger.js
    └── responseHandler.js
```

## 🚀 First API Call

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

### Copy the token from response

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
  -H "Authorization: Bearer $TOKEN"
```

## 💬 Test Socket.IO (Real-Time)

Create `test-socket.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to server');
});

socket.on('user_connected', (data) => {
  console.log('👤 User connected:', data.username);
});

// Send message
socket.emit('send_message', {
  recipientId: 'RECIPIENT_USER_ID',
  content: 'Hello from Socket.IO!',
  messageType: 'text'
});

// Receive message
socket.on('receive_message', (data) => {
  console.log('📨 New message:', data.message.content);
});

// Disconnect
setTimeout(() => {
  socket.disconnect();
  console.log('❌ Disconnected');
}, 5000);
```

Run it:
```bash
node test-socket.js
```

## 🔗 MongoDB Connection

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/ur-message
```

Start MongoDB:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create user and password
4. Get connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ur-message
```

## 🖼️ Cloudinary Setup (Image Uploads)

1. Go to https://cloudinary.com
2. Sign up for free account
3. Copy credentials:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
brew services start mongodb-community

# Check connection string in .env
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Token Expired
- Generate new token by logging in again
- Check JWT_EXPIRE in .env (default: 7d)

### CORS Error
- Check CLIENT_URL in .env matches your frontend origin
- Ensure CORS is enabled in server.js

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [API_TESTING.md](API_TESTING.md) for complete API examples
3. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
4. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## 🎓 Learning Resources

- [Node.js Guide](https://nodejs.org/en/docs/guides/)
- [Express Tutorial](https://expressjs.com/en/starter/basic-routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Socket.IO Tutorial](https://socket.io/docs/v4/tutorial/introduction/)
- [JWT Explanation](https://jwt.io/introduction)

## 💡 Tips

- Use Postman or Insomnia for API testing
- Keep .env file secure (never commit it)
- Use `npm run dev` during development
- Check logs for debugging: `npm run dev 2>&1 | tee app.log`
- Install MongoDB Compass for database GUI

## ✅ Verify Installation

Run all these to verify setup:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB
mongosh --eval "db.version()"

# Start server
npm run dev

# In another terminal, test health endpoint
curl http://localhost:5000/health
```

---

**Quick Start Guide** - Ready to code! 🚀
