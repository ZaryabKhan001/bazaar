/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

export const rateLimiter = (maxRequestsIp: number, maxRequestsUser: number, duration: number) => {
  return rateLimit({
    limit: (req: any) => (req.user ? maxRequestsUser : maxRequestsIp),
    windowMs: duration,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: true,
    keyGenerator: (req: any) => {
      if (req.user?.id) return `user-${req.user.id}`;
      return ipKeyGenerator(req);
    },
    handler: (req, res) => {
      console.log('Rate limit exceeded.');
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    },
  });
};
