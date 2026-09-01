import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and RBAC to all project routes
router.use(protect);
router.use(authorizeRoles('freelancer'));

// Routes
router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

export default router;
