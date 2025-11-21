import { NextFunction, Request, Response } from 'express';
import {
  validateRegistrationData,
  checkOtpRestrictions,
  trackOTPRequests,
  sendOtp,
  verifyOTP,
  validateLoginData,
  generateTokens,
} from '../utils/auth.utils';
import prisma from '../../../../packages/libs/prisma';
import { AuthError, ValidationError } from '../../../../packages/error-handler/index';
import bcrypt from 'bcryptjs';
import { setCookie } from '../utils/cookies/setCookie';

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

export const handleVerifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, otp, name } = req.body;
    if (!otp) {
      return next(new ValidationError('OTP is required.'));
    }

    // verify otp
    await verifyOTP(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({ data: { name, email, password: hashedPassword } });

    return res.status(200).json({
      success: true,
      message: 'User registered successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateLoginData(req.body);
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new AuthError(404, 'User does not Exists!');
    }

    const isMatching = await bcrypt.compare(password, user?.password as string);

    if (!isMatching) {
      throw new AuthError(400, 'Password Incorrect!');
    }

    const { accessToken, refreshToken } = await generateTokens(user?.id, email);

    setCookie(res, 'access_token', accessToken);
    setCookie(res, 'refresh_token', refreshToken);

    return res.status(200).json({
      success: true,
      message: 'User LoggedIn Successfully!',
      user: {
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};
