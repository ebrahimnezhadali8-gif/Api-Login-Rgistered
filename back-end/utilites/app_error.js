class AppError extends Error {
  constructor({ errorCode, message, statusCode = 400 }) {
    super(message);
    this.name = "AppError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
