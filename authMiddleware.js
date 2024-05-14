// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleError } = require('../utils/errorUtils');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(handleError(null, 'No token provided', 401));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(handleError(null, 'User not found', 401));
    }

    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };
    next();
  } catch (err) {
    next(handleError(err, 'Invalid token', 401));
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(handleError(null, 'Forbidden: Admin access required', 403));
    }
    next();
  } catch (err) {
    next(handleError(err, 'Error checking admin access', 500));
  }
};