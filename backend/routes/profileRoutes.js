import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAdmin } from '../controllers/userController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', requireAdmin, upload.single('heroImage'), updateProfile);

export default router;
