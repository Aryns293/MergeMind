import { verifyToken } from '../utils/jwt.js';
import { findUserById } from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 1. Verify token
    const decoded = verifyToken(token);

    // 2. Check if user still exists
    const currentUser = await findUserById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Invalid token or session expired.', 401));
  }
};
