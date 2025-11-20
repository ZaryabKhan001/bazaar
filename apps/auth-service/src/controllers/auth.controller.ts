import { NextFunction, Request, Response } from 'express';
import { validateRegistrationData, checkOtpRestrictions, trackOTPRequests, sendOtp } from '../utils/auth.utils';
import prisma from '../../../../packages/libs/prisma';
import { ValidationError } from '../../../../packages/error-handler/index';

export const handleUserRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email, name } = req.body;

    const isUserAlreadyExists = await prisma.users.findUnique({ where: { email } });

    if (isUserAlreadyExists) {
      return next(new ValidationError('User Already Exists with this Email!'));
    }

    // check otp
    await checkOtpRestrictions(email, next);

    // track OTP
    await trackOTPRequests(email, next);

    // sending OTP
    await sendOtp(name, email, 'user-activation-mail');

    return res.status(201).json({
      success: true,
      message: 'OTP sent to your Email. Please verify your Account.',
    });
  } catch (error) {
    return next(error);
  }
};
