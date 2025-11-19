import { NextFunction } from 'express';
import { ValidationError } from '../../../../packages/error-handler/index';
import crypto from 'crypto';
import { redis } from '../../../../packages/libs/redis';
import { sendEmail } from './sendMail/index';
import { redis_keys } from './constants';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper to safely access redis_keys with proper typing
const getRedisKey = (key: keyof typeof redis_keys): string => redis_keys[key];

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
  if (await redis.get(`${getRedisKey('otp_lock')}${email}`)) {
    return next(new ValidationError('Account Locked, due to multiple failed attempts. Try again after 30 minutes.'));
  }
  if (await redis.get(`${getRedisKey('otp_spam_lock')}${email}`)) {
    return next(new ValidationError('Too many OTP Requests! Please wait 1 hour before requesting again.'));
  }

  if (await redis.get(`${getRedisKey('otp_cooldown')}${email}`)) {
    return next(new ValidationError('Please wait 1 minute before requesting a new OTP!'));
  }

};

export const trackOTPRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `${getRedisKey('otp_request_count')}${email}`;
  const otpRequests = Number((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`${getRedisKey('otp_spam_lock')}${email}`, 'locked', 'EX', 3600); // lock for 1 hour
    return next(new ValidationError('Too many OTP Requests! Please wait 1 hour before requesting again.'));
  }

  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // for  1 hour
};

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, 'Verify Your Email', template, { name, otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
};
