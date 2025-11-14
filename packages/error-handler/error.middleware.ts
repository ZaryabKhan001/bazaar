import { Request, Response } from 'express';
import { AppError } from './index.js';

export const errorMiddleware = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    console.log(`Error in ${req.method} request on ${req.url}.`);
    console.log(`Error Details: ${err}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  console.log('Unhandled Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went Wrong',
  });
};
