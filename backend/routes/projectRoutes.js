import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { requireAdmin } from '../controllers/userController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', requireAdmin, upload.single('image'), createProject);
router.put('/:id', requireAdmin, upload.single('image'), updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;
