/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction } from 'express';
import { ValidationError } from '../../../../packages/error-handler/index';
import crypto from 'crypto';
import { redis } from '../../../../packages/libs/redis';
import { sendEmail } from './sendMail/index';
import { redis_keys } from './constants';
import jwt from 'jsonwebtoken';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper to safely access redis_keys with proper typing
const getRedisKey = (key: keyof typeof redis_keys): string => redis_keys[key];

export const validateRegistrationData = (data: any, userType: 'seller' | 'user') => {
  const { name, email, password, phone_number, country } = data;

  const isSeller = userType === 'seller';

  if (!name || !email || !password) {
    throw new ValidationError('Name, email, and password are required.');
  }

  if (isSeller && (!phone_number || !country)) {
    throw new ValidationError('Phone number and country are required for sellers.');
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid Email format!');
  }
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`${getRedisKey('otp_lock')}${email}`)) {
    throw new ValidationError('Account Locked, due to multiple failed attempts. Try again after 30 minutes.');
  }
  if (await redis.get(`${getRedisKey('otp_spam_lock')}${email}`)) {
    throw new ValidationError('Too many OTP Requests! Please wait 1 hour before requesting again.');
  }

  if (await redis.get(`${getRedisKey('otp_cooldown')}${email}`)) {
    throw new ValidationError('Please wait 1 minute before requesting a new OTP!');
  }
};

export const trackOTPRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `${getRedisKey('otp_request_count')}${email}`;
  const otpRequests = Number((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`${getRedisKey('otp_spam_lock')}${email}`, 'locked', 'EX', 3600); // lock for 1 hour
    throw new ValidationError('Too many OTP Requests! Please wait 1 hour before requesting again.');
  }

  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // for  1 hour
};

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, 'Verify Your Email', template, { name, otp });

  await redis.set(`${getRedisKey('otp')}${email}`, otp, 'EX', 300);
  await redis.set(`${getRedisKey('otp_cooldown')}${email}`, 'true', 'EX', 60);
};

export const verifyOTP = async (email: string, otp: string, next: NextFunction) => {
  const storedOTP = await redis.get(`${getRedisKey('otp')}${email}`);
  if (!storedOTP) {
    throw new ValidationError('Invalid or Expired OTP!');
  }

  const failedAttemptsKey = `${getRedisKey('otp_attempts')}${email}`;
  const failedAttempts = Number((await redis.get(failedAttemptsKey)) || 0);

  if (storedOTP !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`${getRedisKey('otp_lock')}${email}`, 'locked', 'EX', 1800);
      await redis.del(`${getRedisKey('otp')}${email}`, failedAttemptsKey);
      throw new ValidationError('Account Locked, due to multiple failed attempts. Try again after 30 minutes.');
    } else {
      await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);
      throw new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left.`);
    }
  }

  await redis.del(`${getRedisKey('otp')}${email}`, failedAttemptsKey);
};

export const validateLoginData = async (data: any) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new ValidationError('Email and Password are required!');
  }
};

export const generateTokens = async (id: string, email: string, role = 'user') => {
  const accessToken = jwt.sign({ id, email, role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id, email, role }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};
