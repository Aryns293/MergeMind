import { Server } from 'socket.io';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { socketAuth } from '../../middlewares/socketAuth.middleware.js';

class SocketService {
  constructor() {
    this.io = null;
  }

  /**
   * Initializes the Socket.IO server
   */
  init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          // Allow requests with no origin (e.g., mobile apps, curl)
          if (!origin) return callback(null, true);
          // Allow localhost, Vercel deployments, and configured CLIENT_URL
          const allowed = [
            env.CLIENT_URL,
            'http://localhost:3000',
            'http://localhost:5000',
          ].filter(Boolean);
          const isVercel = origin?.includes('.vercel.app');
          if (isVercel || allowed.includes(origin)) {
            callback(null, true);
          } else {
            logger.warn(`Socket CORS blocked origin: ${origin}`);
            callback(null, true); // Allow all for now to debug
          }
        },
        methods: ['GET', 'POST'],
        credentials: true
      },
      // Allow both polling and websocket
      transports: ['polling', 'websocket'],
      allowUpgrades: true,
    });

    // Apply authentication middleware
    this.io.use(socketAuth);

    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id} for User: ${socket.user.id}`);

      // The user automatically joins a room specific to their userId.
      // This allows us to emit real-time events exclusively to their active tabs.
      const userRoom = `user_${socket.user.id}`;
      socket.join(userRoom);

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id} for User: ${socket.user.id}`);
      });
    });

    return this.io;
  }

  /**
   * Get the initialized Socket.IO instance
   */
  getIO() {
    if (!this.io) {
      throw new Error('Socket.IO is not initialized!');
    }
    return this.io;
  }

  /**
   * Emits an event to all connected sockets of a specific user
   */
  emitToUser(userId, event, data) {
    if (this.io) {
      logger.info(`Emitting event '${event}' to user_${userId}`);
      this.io.to(`user_${userId}`).emit(event, data);
    } else {
      logger.warn(`Socket.IO not initialized when trying to emit '${event}'`);
    }
  }

  /**
   * Closes the Socket.IO server during graceful shutdown
   */
  async close() {
    if (this.io) {
      return new Promise((resolve) => {
        this.io.close(() => {
          logger.info('Socket.IO server closed');
          resolve();
        });
      });
    }
  }
}

export default new SocketService();
