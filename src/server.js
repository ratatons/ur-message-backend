const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config/config');
const connectDB = require('./config/database');
const { initializeSocket } = require('./sockets/socketHandler');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ============ MIDDLEWARE ============

// CORS Configuration
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============ DATABASE CONNECTION ============

// Connect to MongoDB
connectDB();

// ============ SOCKET.IO SETUP ============

initializeSocket(io);

// ============ API ROUTES ============

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/users', userRoutes);

// Message/Chat routes
app.use('/api/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// ============ ERROR HANDLER ============

// Global error handling middleware
app.use(errorHandler);

// ============ SERVER START ============

const PORT = config.PORT;

server.listen(PORT, () => {
  logger.success(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${config.NODE_ENV}`);
  logger.info(`🔗 CORS enabled for: ${config.CLIENT_URL}`);
  logger.info(`💾 MongoDB: ${config.MONGODB_URI}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.warning('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.success('Server shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warning('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.success('Server shut down');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

module.exports = server;
