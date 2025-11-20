import express from 'express';
import { handleUserRegistration, handleVerifyOTP } from '../controllers/auth.controller';

const router = express.Router();

router.post('/user-registration', handleUserRegistration);
router.post('/verify-user', handleVerifyOTP);

export default router;
