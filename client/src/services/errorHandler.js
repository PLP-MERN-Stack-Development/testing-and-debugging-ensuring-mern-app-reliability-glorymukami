// Global error handling utilities

export class AppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Global error logger
export const errorLogger = {
  info: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
    // In production, send to logging service like Sentry
  },
  
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    // Send to error tracking service in production
  },
  
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

// Error boundary for API calls
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    errorLogger.error(`API Error ${status}`, error);
    
    switch (status) {
      case 400:
        throw new AppError(data.error || 'Bad Request', 'VALIDATION_ERROR', data.details);
      case 401:
        throw new AppError('Please log in again', 'UNAUTHORIZED');
      case 403:
        throw new AppError('Access denied', 'FORBIDDEN');
      case 404:
        throw new AppError('Resource not found', 'NOT_FOUND');
      case 500:
        throw new AppError('Server error, please try again later', 'SERVER_ERROR');
      default:
        throw new AppError(data.error || 'Something went wrong', 'UNKNOWN_ERROR');
    }
  } else if (error.request) {
    // Request made but no response received
    errorLogger.error('Network Error', error);
    throw new AppError('Network error, please check your connection', 'NETWORK_ERROR');
  } else {
    // Something else happened
    errorLogger.error('Unknown Error', error);
    throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
};
