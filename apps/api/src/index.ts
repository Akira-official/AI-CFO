import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pino from 'pino';

import { trendsRouter } from './routes/trends.js';
import { agentsRouter } from './routes/agents.js';
import { pipelineRouter } from './routes/pipeline.js';
import { workflowsRouter } from './routes/workflows.js';
import { authRouter } from './routes/auth.js';
import { setupRedis } from './services/redis.js';
import { setupPostgres } from './db/index.js';
import { initializeAgents } from './agents/index.js';
import { WebSocketHandler } from './services/websocket.js';

dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trends', trendsRouter);
app.use('/api/v1/agents', agentsRouter);
app.use('/api/v1/pipeline', pipelineRouter);
app.use('/api/v1/workflows', workflowsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  });
});

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO for real-time updates
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

WebSocketHandler.initialize(io);

// Initialize services
async function bootstrap() {
  try {
    logger.info('🚀 Starting Vyoma Intelligence API...');

    // Setup database
    await setupPostgres();
    logger.info('✅ PostgreSQL connected');

    // Setup Redis
    await setupRedis();
    logger.info('✅ Redis connected');

    // Initialize AI agents
    await initializeAgents();
    logger.info('✅ AI Agents initialized');

    // Start server
    server.listen(PORT, () => {
      logger.info(`🎯 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Bootstrap failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

bootstrap();

export default app;
