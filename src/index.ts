import "reflect-metadata";
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger, { requestLogger } from './config/logger';
import { AppDataSource } from './config/typeorm.config';

import taskRoutes from './routes/task';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

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
                ip: req.ip
            });
            res.status(404).render('error', {
                message: 'Page not found',
                error: {}
            });
        });

        // Error handling middleware
        app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
            // Log the error
            logger.error('Unhandled error:', {
                error: err.message,
                stack: err.stack,
                path: req.path,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
            
            // Check if it's a static file error
            if (req.path.startsWith('/scripts/') || req.path.startsWith('/css/') || req.path.startsWith('/images/')) {
                res.status(404).send('Resource not found');
                return;
            }
            
            // Send error response for other errors
            res.status(500).render('error', { 
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });

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
    .catch((error) => {
        logger.error("Error during Data Source initialization:", error);
        process.exit(1);
    }); 