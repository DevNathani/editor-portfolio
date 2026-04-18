import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController.js';
import { requireAdmin } from '../controllers/userController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAchievements);
router.post('/', requireAdmin, upload.array('images', 10), createAchievement);
router.put('/:id', requireAdmin, upload.array('images', 10), updateAchievement);
router.delete('/:id', requireAdmin, deleteAchievement);

export default router;
