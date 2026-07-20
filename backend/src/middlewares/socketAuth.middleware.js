import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../config/prisma.js';

/**
 * Socket.io middleware to authenticate connections via JWT
 */
export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true }
    });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user to socket instance
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};
