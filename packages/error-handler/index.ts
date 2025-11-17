/* eslint-disable @typescript-eslint/no-explicit-any */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(statuscode: number, isOperational = true, message: string, details?: any) {
    super(message);
    this.statusCode = statuscode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

//? Not Found Error
export class NotFoundError extends AppError {
  constructor(message = 'Resources not found') {
    super(404, false, message);
  }
}

//? Validation Error
export class ValidationError extends AppError {
  constructor(message = 'Invalid Request Data', details?: any) {
    super(400, true, message, details);
  }
}

//? Authentication Error
export class AuthError extends AppError {
  constructor(statusCode = 401, message = 'Authentication Failed', details?: any) {
    super(statusCode, true, message, details);
  }
}

//? Forbidden Error (For Insufficient Access)
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden Access') {
    super(403, true, message);
  }
}

//? Database Error (MongoDB / Postgres)
export class DatabaseError extends AppError {
  constructor(message = 'Database Error', details?: any) {
    super(500, true, message, details);
  }
}

//? RateLimit Error
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later', details?: any) {
    super(429, true, message, details);
  }
}
