# SETUP_VERIFICATION.md - Installation Verification Guide

## ✅ Complete Installation Checklist

After completing the installation, run through this checklist to verify everything is working.

---

## 1️⃣ Environment Setup

### Check Node.js Installation
```bash
node --version
# Expected output: v14.0.0 or higher

npm --version
# Expected output: 6.0.0 or higher
```

### Check .env File
```bash
# Verify .env exists
ls .env

# Check contents
cat .env
```

**Expected variables:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ur-message
JWT_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
CLIENT_URL=http://localhost:3000
```

---

## 2️⃣ Dependencies Installation

### Check package.json
```bash
# Verify package.json exists
cat package.json

# Check key dependencies are listed
grep -E "express|mongoose|socket.io|jsonwebtoken|bcryptjs" package.json
```

### Install Dependencies
```bash
npm install
# Should complete without errors

# Verify node_modules created
ls node_modules | wc -l
# Should show 100+ packages
```

---

## 3️⃣ Database Setup

### MongoDB Connection

**For Local MongoDB:**
```bash
# Check MongoDB installation
mongod --version

# Start MongoDB service
mongod
# Or on macOS:
brew services start mongodb-community

# Connect to database
mongosh
# Type: exit (to quit)
```

**For MongoDB Atlas:**
```bash
# Test connection string
mongosh "<your_connection_string>"
# Should connect successfully
```

### Verify Connection

```bash
mongosh
> use ur-message
> db.users.find()  # Should return empty array
> exit
```

---

## 4️⃣ Project Structure Verification

### Check All Directories Exist
```bash
cd src

# List all directories
ls -la

# Expected directories:
# config/ controllers/ middleware/ models/ routes/ sockets/ utils/
```

### Check All Core Files Exist
```bash
# Should output true/false for each
test -f server.js && echo "server.js: ✅" || echo "server.js: ❌"
test -f config/config.js && echo "config/config.js: ✅" || echo "config/config.js: ❌"
test -f models/User.js && echo "models/User.js: ✅" || echo "models/User.js: ❌"
test -f models/Chat.js && echo "models/Chat.js: ✅" || echo "models/Chat.js: ❌"
test -f models/Message.js && echo "models/Message.js: ✅" || echo "models/Message.js: ❌"
test -f controllers/authController.js && echo "controllers/authController.js: ✅" || echo "controllers/authController.js: ❌"
test -f controllers/userController.js && echo "controllers/userController.js: ✅" || echo "controllers/userController.js: ❌"
test -f controllers/messageController.js && echo "controllers/messageController.js: ✅" || echo "controllers/messageController.js: ❌"
test -f routes/authRoutes.js && echo "routes/authRoutes.js: ✅" || echo "routes/authRoutes.js: ❌"
test -f middleware/authenticate.js && echo "middleware/authenticate.js: ✅" || echo "middleware/authenticate.js: ❌"
test -f sockets/socketHandler.js && echo "sockets/socketHandler.js: ✅" || echo "sockets/socketHandler.js: ❌"
```

---

## 5️⃣ Start Server

### Start Development Server
```bash
npm run dev

# Expected output:
# ✅ MongoDB connected successfully
# ✅ Server running on port 5000
# ℹ️  Environment: development
# 🔗 CORS enabled for: http://localhost:3000
# 💾 MongoDB: mongodb://localhost:27017/ur-message
```

**If you see errors:**
- Check MongoDB is running
- Verify .env variables
- Check port 5000 is available
- Review error messages in console

---

## 6️⃣ API Health Check

### Test Health Endpoint
```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-23T..."
}
```

**Curl not available?** Use these alternatives:
- **Windows PowerShell**: `Invoke-WebRequest http://localhost:5000/health`
- **Browser**: Visit http://localhost:5000/health
- **Postman**: Create GET request to http://localhost:5000/health

---

## 7️⃣ Test First API Call

### Create Test User (Sign Up)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123",
    "confirmPassword": "TestPassword123"
  }'

# Expected response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser",
      "email": "test@example.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Issues?**
- Check server is running
- Verify MongoDB is connected
- Check .env PORT is set to 5000
- Review error message in response

---

## 8️⃣ Test Authentication

### Copy Token from Signup Response
```bash
# Save the token from signup response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    ...
  }
}
```

---

## 9️⃣ Database Verification

### Check Data Was Saved
```bash
mongosh

> use ur-message
> db.users.findOne()

# Expected output:
{
  _id: ObjectId("..."),
  username: 'testuser',
  email: 'test@example.com',
  ...
}

> exit
```

---

## 🔟 Documentation Check

### Verify All Documentation Files
```bash
# Check documentation files exist
ls -la *.md

# Expected files:
# README.md
# QUICKSTART.md
# API_TESTING.md
# ARCHITECTURE.md
# DEPLOYMENT.md
# CONTRIBUTING.md
# CHANGELOG.md
# PROJECT_SUMMARY.md
# SETUP_VERIFICATION.md (this file)
```

---

## 📋 Full Setup Verification Script

Create `verify-setup.sh`:

```bash
#!/bin/bash

echo "🔍 UR-Message Backend Setup Verification"
echo "========================================"
echo ""

# Check Node.js
echo "1️⃣ Checking Node.js..."
if command -v node &> /dev/null; then
  echo "✅ Node.js: $(node --version)"
else
  echo "❌ Node.js not found"
  exit 1
fi

# Check npm
echo ""
echo "2️⃣ Checking npm..."
if command -v npm &> /dev/null; then
  echo "✅ npm: $(npm --version)"
else
  echo "❌ npm not found"
  exit 1
fi

# Check .env
echo ""
echo "3️⃣ Checking .env file..."
if [ -f .env ]; then
  echo "✅ .env file exists"
else
  echo "❌ .env file not found"
  exit 1
fi

# Check node_modules
echo ""
echo "4️⃣ Checking node_modules..."
if [ -d node_modules ]; then
  echo "✅ node_modules directory exists"
  echo "   Packages installed: $(ls node_modules | wc -l)"
else
  echo "❌ node_modules not found"
  echo "   Run: npm install"
  exit 1
fi

# Check src directory
echo ""
echo "5️⃣ Checking src directory structure..."
if [ -d src ]; then
  echo "✅ src directory exists"
  if [ -f src/server.js ]; then
    echo "✅ src/server.js exists"
  fi
  if [ -d src/config ]; then
    echo "✅ src/config exists"
  fi
  if [ -d src/models ]; then
    echo "✅ src/models exists"
  fi
  if [ -d src/controllers ]; then
    echo "✅ src/controllers exists"
  fi
  if [ -d src/routes ]; then
    echo "✅ src/routes exists"
  fi
  if [ -d src/middleware ]; then
    echo "✅ src/middleware exists"
  fi
  if [ -d src/sockets ]; then
    echo "✅ src/sockets exists"
  fi
  if [ -d src/utils ]; then
    echo "✅ src/utils exists"
  fi
else
  echo "❌ src directory not found"
  exit 1
fi

# Check documentation
echo ""
echo "6️⃣ Checking documentation files..."
docs=("README.md" "QUICKSTART.md" "API_TESTING.md" "ARCHITECTURE.md" "DEPLOYMENT.md")
for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ $doc"
  else
    echo "❌ $doc not found"
  fi
done

# Summary
echo ""
echo "========================================"
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB service"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:5000/health"
echo ""
```

Run it:
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

---

## 🧪 Manual Verification Checklist

Copy this checklist and verify each item:

```
Pre-Installation:
☐ Node.js v14+ installed
☐ MongoDB installed or MongoDB Atlas account ready
☐ Git installed

Installation:
☐ Repository cloned
☐ Dependencies installed (npm install)
☐ .env file created and configured
☐ All source files present

Server Setup:
☐ Database connected (no connection errors)
☐ Server starts without errors
☐ Health endpoint responds (curl test)

API Testing:
☐ Signup endpoint works
☐ Login endpoint works
☐ Get user profile works
☐ JWT authentication works

Database:
☐ MongoDB is running
☐ Database "ur-message" exists
☐ Collections created successfully
☐ Test user saved

Documentation:
☐ README.md readable
☐ API_TESTING.md present
☐ QUICKSTART.md available
☐ ARCHITECTURE.md accessible

Project Structure:
☐ All models present (User, Chat, Message)
☐ All controllers present (auth, user, message)
☐ All routes present (auth, user, message)
☐ All middleware present (authenticate, validators)
☐ Socket.IO handler present
☐ Utilities present
```

---

## 🆘 Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with Atlas connection string
```

### Port Already in Use

**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution:**
```
Check CLIENT_URL in .env matches your frontend origin
```

### Token Invalid

**Error**: `Invalid token`

**Solution:**
```
Generate new token by logging in again
Check JWT_SECRET is consistent
```

---

## ✅ Success Indicators

Your setup is complete when you see:

1. ✅ Server starts without errors
2. ✅ MongoDB connects successfully
3. ✅ Health endpoint responds
4. ✅ Can create user (signup)
5. ✅ Can login user
6. ✅ Can fetch user profile
7. ✅ JWT authentication works
8. ✅ Data saved to MongoDB

---

## 🎉 You're Ready!

If all checks pass, you're ready to:
- Start development
- Test the API
- Build your frontend
- Deploy to production

---

**Setup Verification Guide** - May 23, 2026
