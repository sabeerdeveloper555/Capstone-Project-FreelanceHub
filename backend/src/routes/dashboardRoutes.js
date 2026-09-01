import express from 'express';
import {
  getDashboard,
  getMonthlyProjectStats,
  getProjectStatusStats,
  getFinancialStats
} from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and freelancer RBAC to all dashboard routes
router.use(protect);
router.use(authorizeRoles('freelancer'));

// Dashboard endpoints
router.get('/', getDashboard);
router.get('/projects/monthly', getMonthlyProjectStats);
router.get('/projects/status', getProjectStatusStats);
router.get('/financials', getFinancialStats);

export default router;
