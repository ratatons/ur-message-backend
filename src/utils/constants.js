/**
 * Application Constants
 * Centralized configuration for constants used throughout the application
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// User Status
const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
};

// Message Types
const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  EMOJI: 'emoji',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
};

// Validation Rules
const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    REGEX: /^[a-z0-9_-]{3,30}$/,
    MESSAGE: 'Username must be 3-30 characters with only lowercase letters, numbers, underscore, or hyphen',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'Password must be at least 6 characters',
  },
  EMAIL: {
    REGEX: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    MESSAGE: 'Invalid email format',
  },
  BIO: {
    MAX_LENGTH: 160,
    MESSAGE: 'Bio cannot exceed 160 characters',
  },
  MESSAGE: {
    MAX_LENGTH: 5000,
    MESSAGE: 'Message cannot exceed 5000 characters',
  },
  SEARCH_QUERY: {
    MIN_LENGTH: 2,
    MESSAGE: 'Search query must be at least 2 characters',
  },
};

// Pagination
const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

// Database
const DATABASE = {
  COLLECTIONS: {
    USERS: 'users',
    CHATS: 'chats',
    MESSAGES: 'messages',
  },
  INDEXES: {
    USERNAME: 'username',
    EMAIL: 'email',
    PARTICIPANTS: 'participants',
    CHAT_ID: 'chat',
    CREATED_AT: 'createdAt',
  },
};

// JWT
const JWT = {
  DEFAULT_EXPIRY: '7d',
  ALGORITHM: 'HS256',
};

// Bcrypt
const BCRYPT = {
  SALT_ROUNDS: 10,
};

// File Upload
const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  CLOUDINARY_FOLDER: 'ur-message',
};

// Error Messages
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  ALREADY_EXISTS: 'Already exists',
  NOT_FOUND: 'Not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  NOT_FRIENDS: 'Users are not friends',
  ALREADY_FRIENDS: 'Already friends',
  BLOCKED_USER: 'Cannot perform action on blocked user',
};

// Success Messages
const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  USER_UPDATED: 'User updated successfully',
  FRIEND_ADDED: 'Friend added successfully',
  FRIEND_REMOVED: 'Friend removed successfully',
  MESSAGE_SENT: 'Message sent successfully',
  MESSAGE_DELETED: 'Message deleted successfully',
  MESSAGE_MARKED_READ: 'Message marked as read',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Socket Events
const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // User events
  USER_CONNECTED: 'user_connected',
  USER_DISCONNECTED: 'user_disconnected',
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  USER_STATUS_CHANGED: 'user_status_changed',
  UPDATE_STATUS: 'update_status',
  
  // Message events
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_READ: 'message_read',
  MESSAGE_READ_RECEIPT: 'message_read_receipt',
  MESSAGE_DELETED: 'message_deleted',
  
  // Typing events
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
};

// API Endpoints
const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    GET_PROFILE: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
  },
  USERS: {
    SEARCH: '/users/search',
    GET_PROFILE: '/users/:userId',
    GET_STATUS: '/users/status',
    UPDATE_STATUS: '/users/status',
    GET_FRIENDS: '/users/friends/list/all',
    ADD_FRIEND: '/users/friends/add',
    REMOVE_FRIEND: '/users/friends/:friendId',
  },
  MESSAGES: {
    GET_CHATS: '/messages',
    GET_MESSAGES: '/messages/:chatId/messages',
    SEND_MESSAGE: '/messages/send',
    MARK_READ: '/messages/:messageId/read',
    DELETE_MESSAGE: '/messages/:messageId',
  },
};

// Rate Limiting
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // per window
  LOGIN_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  LOGIN_MAX_ATTEMPTS: 5,
};

// Cache Duration (in seconds)
const CACHE_DURATION = {
  USER_PROFILE: 60 * 5, // 5 minutes
  USER_SEARCH: 60, // 1 minute
  FRIEND_LIST: 60 * 10, // 10 minutes
};

// Common Regex Patterns
const REGEX = {
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  USERNAME: /^[a-z0-9_-]{3,30}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^\+?[\d\s\-\(\)\.]{10,}$/,
};

// Environment Variables
const ENV_VARS = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
};

// Time Constants (in milliseconds)
const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
};

// Response Formats
const RESPONSE_FORMAT = {
  SUCCESS: {
    success: true,
    message: '',
    data: null,
  },
  ERROR: {
    success: false,
    message: '',
    error: null,
  },
};

// Export all constants
module.exports = {
  HTTP_STATUS,
  USER_STATUS,
  MESSAGE_TYPE,
  VALIDATION,
  PAGINATION,
  DATABASE,
  JWT,
  BCRYPT,
  FILE_UPLOAD,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SOCKET_EVENTS,
  API_ENDPOINTS,
  RATE_LIMIT,
  CACHE_DURATION,
  REGEX,
  ENV_VARS,
  TIME,
  RESPONSE_FORMAT,
};
