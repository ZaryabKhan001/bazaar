import { NextFunction, Request, Response } from 'express';
import { validateRegistrationData, checkOtRestrictions } from '../utils/auth.utils';
import prisma from '../../../../packages/libs/prisma';
import { AuthError, ValidationError } from '../../../../packages/error-handler/index';

export const handleUserRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email } = req.body;

    const isUserAlreadyExists = await prisma.users.findUnique({ where: email });

    if (isUserAlreadyExists) {
      return next(new ValidationError('User Already Exists with this Email!'));
    }

    // check otp
    await checkOtRestrictions(email, next);

    res.status(201).json();
  } catch (error) {
    console.log('Error in User Registration', error);
    return next(new AuthError(500, 'Error in User Registration'));
  }
};
