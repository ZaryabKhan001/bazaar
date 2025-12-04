import express from 'express';
import {
  handleUserRegistration,
  handleVerifyOTP,
  handleUserLogin,
  handleRefreshToken,
  handleUserForgotPassword,
  handleUserResetPassword,
  handleUserVerifyForgotPasswordOTP,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/user-registration', handleUserRegistration);
router.post('/verify-user', handleVerifyOTP);
router.post('/login-user', handleUserLogin);
router.post('/refresh-token-user', handleRefreshToken);
router.post('/forgot-password-user', handleUserForgotPassword);
router.post('/verify-forgot-password-user', handleUserVerifyForgotPasswordOTP);
router.post('/reset-password-user', handleUserResetPassword);

export default router;
