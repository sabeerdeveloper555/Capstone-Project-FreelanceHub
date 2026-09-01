import express from 'express';
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and RBAC to all client routes
router.use(protect);
router.use(authorizeRoles('freelancer'));

// Routes
router.route('/')
  .post(createClient)
  .get(getClients);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

export default router;
