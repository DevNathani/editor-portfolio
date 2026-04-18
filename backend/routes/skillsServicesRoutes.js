import express from 'express';
import { getSkillsServices, updateSkillsServices } from '../controllers/skillsServicesController.js';
import { requireAdmin } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getSkillsServices);
router.put('/', requireAdmin, updateSkillsServices);

export default router;
