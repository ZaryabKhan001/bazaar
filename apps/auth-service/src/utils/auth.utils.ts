import { NextFunction } from 'express';
import { ValidationError } from '../../../../packages/error-handler/index';
import crypto from 'crypto';
import { redis } from 'packages/libs/redis';
import { sendEmail } from './sendMail/index';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateRegistrationData = (data: any, userType: 'seller' | 'user') => {
  const { name, email, password, phone_number, country } = data;

  if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country))) {
    throw new ValidationError('Missing required fields');
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid Email format!');
  }
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError('Account Locked, due to multiple failed attempts. Try again after 30 minutes.'));
  }
};

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, 'Verify Your Email', template, { name, otp });
  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
};
