/**
 * API Response Helper
 * Standardizes API response format
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
