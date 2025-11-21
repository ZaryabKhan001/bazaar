import express from 'express';
import { handleUserRegistration, handleVerifyOTP, handleUserLogin } from '../controllers/auth.controller';

const router = express.Router();

router.post('/user-registration', handleUserRegistration);
router.post('/verify-user', handleVerifyOTP);
router.post('/login-user', handleUserLogin);

export default router;
