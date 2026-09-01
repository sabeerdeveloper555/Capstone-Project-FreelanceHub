import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from './asyncHandler.js';

/**
 * Middleware to protect routes and authenticate requests via JWT
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET || 'freelancehub_pk_default_dev_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      // Fetch user and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
});

/**
 * Reusable Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles - Permitted roles (e.g. 'freelancer', 'client')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};
