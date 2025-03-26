import "reflect-metadata";
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger, { requestLogger } from './config/logger';
import { AppDataSource } from './config/typeorm.config';

import taskRoutes from './routes/task';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const ERROR_MESSAGES = {
  PAGE_NOT_FOUND: 'Page not found',
  INTERNAL_ERROR: 'Something went wrong!',
  RESOURCE_NOT_FOUND: 'Resource not found'
} as const;

interface ErrorResponse {
  message: string;
  error: Record<string, unknown>;
}

const createErrorResponse = (message: string, error?: unknown): ErrorResponse => ({
  message,
  error: error instanceof Error ? {
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  } : {}
});

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        logger.info("Database connection initialized successfully");
        
        const app = express();

        // View engine setup
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, process.env.NODE_ENV === 'production' ? 'src/views' : 'views'));

        // Middleware
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname, process.env.NODE_ENV === 'production' ? 'src/public' : 'public')));

        // Request logging middleware
        app.use(requestLogger);

        // Routes
        app.use('/', taskRoutes);

        // 404 handler
        app.use((req: Request, res: Response) => {
            logger.warn('404 Not Found', {
                path: req.path,
                method: req.method,
                ip: req.ip,
                timestamp: new Date().toISOString()
            });
            res.status(404).render('error', createErrorResponse(ERROR_MESSAGES.PAGE_NOT_FOUND));
        });

        // Error handling middleware
        app.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
            // Log the error
            logger.error('Unhandled error:', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
                path: req.path,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('user-agent'),
                timestamp: new Date().toISOString()
            });
            
            // Check if it's a static file error
            if (req.path.startsWith('/scripts/') || req.path.startsWith('/css/') || req.path.startsWith('/images/')) {
                res.status(404).send(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
                return;
            }
            
            // Send error response for other errors
            res.status(500).render('error', createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, err));

            // Pass error to next middleware if any
            next(err);
        });

        // Start server
        app.listen(port, (): void => {
            logger.info('Server started', {
                port,
                environment: process.env.NODE_ENV || 'development',
                nodeVersion: process.version
            });
        });
    })
    .catch((error: unknown) => {
        logger.error("Error during Data Source initialization:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        process.exit(1);
    }); 