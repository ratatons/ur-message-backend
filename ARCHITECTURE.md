# ARCHITECTURE.md - System Architecture & Design

## System Overview

UR-Message is a real-time messaging platform with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│              (Web, Mobile, Desktop Clients)                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                  (HTTP + WebSocket)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Request Handling Layer                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ Auth Routes  │  │ User Routes  │  │Message Routes│ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Middleware Layer                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │Authenticate  │  │  Validators  │  │Error Handler │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            Business Logic Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ AuthCtrl     │  │ UserCtrl     │  │MessageCtrl   │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────│  │
│  │  │         Socket.IO Event Handler                    │  │
│  │  └────────────────────────────────────────────────────│  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Data Access Layer                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ User Model   │  │ Chat Model   │  │Message Model │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
            ↕                           ↕
      ┌──────────────┐         ┌──────────────────┐
      │  MongoDB     │         │  Cloudinary      │
      │  Database    │         │  (Image Storage) │
      └──────────────┘         └──────────────────┘
```

## Architecture Patterns

### 1. MVC (Model-View-Controller) Pattern

- **Models**: Mongoose schemas for User, Chat, Message
- **Controllers**: Business logic for auth, users, messaging
- **Views**: JSON API responses (no traditional views)

### 2. Middleware Pattern

- Authentication middleware for token verification
- Validation middleware for input sanitization
- Error handling middleware for centralized error management

### 3. Layered Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (Routes)       │
├─────────────────────────────────────┤
│   Business Logic Layer (Controllers)│
├─────────────────────────────────────┤
│   Data Access Layer (Models)        │
├─────────────────────────────────────┤
│   Database Layer (MongoDB)          │
└─────────────────────────────────────┘
```

### 4. Real-Time Communication with Socket.IO

Socket.IO enables bidirectional communication:

```
Client                          Server
  │                               │
  ├──── send_message ────────────→│
  │                               │
  │                               ├─ Process message
  │                               ├─ Save to database
  │                               ├─ Emit to recipient
  │                               │
  │←─── receive_message ──────────┤
  │                               │
  ├──── typing ───────────────────→│
  │                               ├─ Emit to recipient
  │←─── user_typing ──────────────┤
  │                               │
```

## Data Flow

### 1. Authentication Flow

```
User Input
    ↓
Validation (email, password)
    ↓
Check if user exists
    ↓
Hash password (bcrypt)
    ↓
Create user in database
    ↓
Generate JWT token
    ↓
Return user + token to client
```

### 2. Message Flow

```
Client sends message
    ↓
Express server receives
    ↓
Authentication middleware verifies token
    ↓
Message controller processes
    ↓
Message saved to MongoDB
    ↓
Chat updated with lastMessage
    ↓
Socket.IO emits to recipient if online
    ↓
Recipient receives in real-time
    ↓
If offline, message stored for retrieval
```

### 3. Friend Addition Flow

```
User A wants to add User B
    ↓
API request with User B's ID
    ↓
Validation: Is User B real? Is not self?
    ↓
Bidirectional friend relationship created
    ↓
Both users updated in database
    ↓
Response sent with updated friends list
```

## Database Schema Relationships

```
┌──────────────────────┐
│       User           │
├──────────────────────┤
│ _id                  │
│ username             │
│ email                │
│ password (hashed)    │
│ profilePicture       │
│ bio                  │
│ status               │
│ lastSeen             │
│ friends []  ────────┐
│ blockedUsers []     │└─→ References to other Users
└──────────────────────┘

┌──────────────────────┐
│       Chat           │
├──────────────────────┤
│ _id                  │
│ participants [] ────┐
│ lastMessage ────────┼──→ References Message
│ lastMessageTime     │
│ isActive            │
└──────────────────────┘
   ↑
   │
   └─→ References Users

┌──────────────────────┐
│     Message          │
├──────────────────────┤
│ _id                  │
│ chat ───────────────→ Chat
│ sender ─────────────→ User
│ content              │
│ messageType          │
│ imageUrl             │
│ isRead               │
│ readAt               │
│ replyTo ────────────→ Message (self-reference)
└──────────────────────┘
```

## API Request/Response Flow

### REST API Example: Send Message

```
1. CLIENT REQUEST
   POST /api/messages/send
   Authorization: Bearer <jwt_token>
   {
     "recipientId": "user_id",
     "content": "Hello!",
     "messageType": "text"
   }

2. MIDDLEWARE PROCESSING
   ├─ Extract token from header
   ├─ Verify JWT signature
   ├─ Fetch user from database
   ├─ Attach user to request object
   └─ Pass to next middleware

3. CONTROLLER PROCESSING
   ├─ Validate input data
   ├─ Check recipient exists
   ├─ Create/get chat between users
   ├─ Create message document
   ├─ Update chat lastMessage
   └─ Populate sender information

4. DATABASE OPERATIONS
   ├─ INSERT Message document
   └─ UPDATE Chat document

5. SOCKET.IO EVENT
   ├─ Check if recipient is online
   ├─ Emit "receive_message" to recipient socket
   └─ Emit "message_sent" confirmation to sender

6. SERVER RESPONSE
   {
     "success": true,
     "message": "Message sent successfully",
     "data": {
       "message": { ...message },
       "chatId": "chat_id"
     }
   }
```

## Socket.IO Real-Time Flow

```
CONNECTION PHASE:
Client connects → Server validates JWT
    ↓
Authenticate middleware processes
    ↓
User added to activeUsers map
    ↓
"user_connected" broadcast to all
    ↓
User joins personal room: user_<userId>

MESSAGING PHASE:
Client emits "send_message"
    ↓
Server handler processes
    ↓
Message saved to database
    ↓
Get recipient socket from activeUsers
    ↓
If online: emit "receive_message" to recipient
If offline: message waits in database
    ↓
Sender gets "message_sent" confirmation
    ↓
Recipient sees new message in real-time

DISCONNECTION PHASE:
Client disconnects
    ↓
Disconnect event triggered
    ↓
User removed from activeUsers
    ↓
User status set to offline
    ↓
lastSeen timestamp updated
    ↓
"user_disconnected" broadcast to all
```

## Scalability Considerations

### Current Design
- Single server instance
- In-memory user tracking
- Direct socket connections

### Future Improvements for Scale

1. **Horizontal Scaling**
   - Use Redis for session management
   - Load balancer for multiple server instances
   - Socket.IO adapter for cross-server communication

2. **Database Optimization**
   - Add indexes on frequently queried fields
   - Implement database sharding for large datasets
   - Archive old messages

3. **Caching**
   - Redis cache for user data
   - Cache friend lists
   - Cache frequently accessed messages

4. **Message Queue**
   - RabbitMQ for offline message delivery
   - Queue for heavy operations
   - Async processing

5. **Monitoring & Analytics**
   - Implement logging with ELK stack
   - Application performance monitoring
   - Database query monitoring

## Security Architecture

### Authentication Layer
```
┌──────────────────────────────────────────┐
│   Request with JWT Token                 │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   Extract Token from Header              │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   Verify Signature with JWT_SECRET       │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   Check Token Expiration                 │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   Fetch User from Database               │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│   Attach User to Request / Allow Access  │
└──────────────────────────────────────────┘
```

### Password Security
```
User enters password
        ↓
Generate salt (bcrypt rounds: 10)
        ↓
Hash password with salt
        ↓
Store hashed password in database
        ↓

Login:
User enters password
        ↓
Retrieve hashed password from database
        ↓
Compare entered password with hash
        ↓
bcrypt.compare() returns true/false
        ↓
Grant/Deny access
```

## Error Handling Architecture

```
REQUEST
  ↓
VALIDATION ERROR
  ├─ Input validation fails
  ├─ Validators middleware catches
  └─ Returns 400 with details

  ↓
AUTHENTICATION ERROR
  ├─ Missing/invalid token
  ├─ Authenticate middleware catches
  └─ Returns 401

  ├─ 
DATABASE ERROR
  ├─ MongoDB operation fails
  ├─ Controller catches
  └─ Error handler processes

  ↓
BUSINESS LOGIC ERROR
  ├─ User not found
  ├─ Already friends, etc.
  ├─ Controller checks
  └─ Returns appropriate status code

  ↓
UNHANDLED ERROR
  ├─ Global error handler catches
  └─ Returns 500
```

## Performance Optimization

### Database Optimization
- Indexes on frequently queried fields
- Pagination for large result sets
- Lean queries where projection possible

### API Optimization
- Response compression
- GZIP middleware (optional)
- Pagination implemented

### Real-Time Optimization
- Socket.IO rooms for targeted broadcasts
- Selective message population
- Efficient event handlers

## Deployment Architecture

```
Development
  ↓
Git Repository
  ↓
CI/CD Pipeline (GitHub Actions)
  ↓
┌──────────────────────────┐
│  Build & Test            │
│  - npm install           │
│  - npm test              │
│  - Lint code             │
└──────────────────────────┘
  ↓
┌──────────────────────────┐
│  Deploy to Production    │
│  - Docker container      │
│  - Environment vars set  │
│  - Start server          │
└──────────────────────────┘
  ↓
┌──────────────────────────┐
│  Running on Server       │
│  - Node.js server        │
│  - MongoDB Atlas         │
│  - Cloudinary CDN        │
└──────────────────────────┘
```

---

**Architecture Document** - Last Updated: May 23, 2026
