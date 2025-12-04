import express from 'express';
import {
  handleUserRegistration,
  handleVerifyOTP,
  handleUserLogin,
  handleRefreshToken,
  handleUserForgotPassword,
  handleUserResetPassword,
  handleUserVerifyForgotPasswordOTP,
  handleGetUser,
} from '../controllers/auth.controller';
import { isAuthenticated } from '../../../../packages/middlewares/isAuthenticated';

const router = express.Router();

router.post('/user-registration', handleUserRegistration);
router.post('/verify-user', handleVerifyOTP);
router.post('/login-user', handleUserLogin);
router.get('/logged-in-user', isAuthenticated, handleGetUser);
router.post('/refresh-token-user', handleRefreshToken);
router.post('/forgot-password-user', handleUserForgotPassword);
router.post('/verify-forgot-password-user', handleUserVerifyForgotPasswordOTP);
router.post('/reset-password-user', handleUserResetPassword);

export default router;
