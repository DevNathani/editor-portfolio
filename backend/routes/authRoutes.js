import express from 'express';
import { requestAccess, approveUser, loginUser, verifyLoginOtp, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/request-access', requestAccess);
router.get('/approve/:token', approveUser);
router.post('/login', loginUser);
router.post('/verify-login', verifyLoginOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
