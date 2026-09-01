import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to get database connection state description
const getDbStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// @desc    Health Check Endpoint
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  const isHealthy = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: 'FreelanceHub PK API is running smoothly',
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null
    }
  });
});

export default router;

