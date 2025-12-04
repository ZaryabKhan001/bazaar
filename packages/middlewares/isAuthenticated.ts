import prisma from '../libs/prisma';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: true,
        message: 'Unauthorized! Token missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; role: string };

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Invalid token.',
      });
    }

    const account = await prisma.users.findUnique({ where: { id: decoded.id } });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Accounnt not found.',
      });
    }

    req.user = account;

    return next();
  } catch (error) {
    console.log('Error in Authentication middleware', error);
    return res.status(500).json({
      success: false,
      message: 'Unauthorized! Invalid or expired token.',
    });
  }
};
