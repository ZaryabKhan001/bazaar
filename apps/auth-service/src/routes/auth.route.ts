import express from 'express';
import { handleUserRegistration } from '../controllers/auth.controller';

const router = express.Router();

router.post('/user-registration', handleUserRegistration);

export default router;
