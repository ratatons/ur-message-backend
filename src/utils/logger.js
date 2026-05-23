/**
 * Logger Utility
 * Simple logging utility for development and production
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const logger = {
  info: (message) => {
    console.log(`${colors.blue}ℹ️  INFO:${colors.reset} ${message}`);
  },
  success: (message) => {
    console.log(`${colors.green}✅ SUCCESS:${colors.reset} ${message}`);
  },
  warning: (message) => {
    console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${message}`);
  },
  error: (message, error = null) => {
    console.error(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
    if (error) console.error(error);
  },
  debug: (message, data = null) => {
    console.log(`${colors.cyan}🐛 DEBUG:${colors.reset} ${message}`);
    if (data) console.log(data);
  },
};

module.exports = logger;
