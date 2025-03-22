import { Request, Response } from 'express';
import db from '../config/database';
import logger from '../config/logger';

interface Task {
    id: number;
    title: string;
    createdAt: string;
    created_at?: string; // For PostgreSQL compatibility
}

interface RunResult {
    lastID?: number;
}

const handleError = (err: Error, res: Response, context: string): void => {
    logger.error('Error occurred:', { 
        error: err.message, 
        stack: err.stack,
        context,
        timestamp: new Date().toISOString()
    });
    res.redirect('/');
};

const isProduction = process.env.NODE_ENV === 'production';
const orderByColumn = isProduction ? 'created_at' : 'createdAt';

const taskController = {
    postAddTask: (req: Request, res: Response): void => {
        // Handle delete action
        if (req.body.action === 'delete' && req.body.taskId) {
            const taskId = parseInt(req.body.taskId);
            if (isNaN(taskId)) {
                return handleError(new Error('Invalid task ID'), res, 'delete-task');
            }

            db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(this: RunResult, err: Error | null) {
                if (err) {
                    handleError(err, res, 'delete-task');
                } else {
                    logger.info('Task deleted successfully', { 
                        taskId,
                        timestamp: new Date().toISOString()
                    });
                    res.redirect('/');
                }
            });
            return;
        }

        // Handle add task action
        const taskText = req.body.taskText;
        if (!taskText) {
            logger.warn('Task creation attempted without text', {
                timestamp: new Date().toISOString()
            });
            return res.redirect('/');
        }

        db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(this: RunResult, err: Error | null) {
            if (err) {
                handleError(err, res, 'create-task');
            } else {
                logger.info('Task created successfully', { 
                    taskText,
                    taskId: this.lastID,
                    timestamp: new Date().toISOString()
                });
                res.redirect('/');
            }
        });
    },

    getAddTask: (req: Request, res: Response): void => {
        if (req.query.taskText) {
            const taskText = req.query.taskText as string;
            db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(this: RunResult, err: Error | null) {
                if (err) {
                    logger.error('Error creating task via GET:', { 
                        error: err.message, 
                        taskText,
                        timestamp: new Date().toISOString()
                    });
                    res.redirect('/error');
                } else {
                    logger.info('Task created successfully via GET', { 
                        taskText,
                        taskId: this.lastID,
                        timestamp: new Date().toISOString()
                    });
                    res.redirect('/');
                }
            });
        } else {
            logger.warn('GET request attempted without task text', {
                timestamp: new Date().toISOString()
            });
            res.redirect('/error');
        }
    },

    getHomeTasks: (req: Request, res: Response): void => {
        db.all(`SELECT * FROM tasks ORDER BY ${orderByColumn} DESC`, [], (err: Error | null, rows: Task[]) => {
            if (err) {
                handleError(err, res, 'get-home-tasks');
            } else {
                // Transform the data to ensure consistent property names
                const transformedRows = rows.map(row => ({
                    ...row,
                    createdAt: row.created_at || row.createdAt
                }));
                
                logger.debug('Tasks retrieved for home page', { 
                    count: transformedRows.length,
                    timestamp: new Date().toISOString()
                });
                res.render('home', {
                    tasklist: transformedRows,
                    pageTitle: 'Giornalino a puntini'
                });
            }
        });
    },

    getAllTasks: (req: Request, res: Response): void => {
        db.all(`SELECT * FROM tasks ORDER BY ${orderByColumn} DESC`, [], (err: Error | null, rows: Task[]) => {
            if (err) {
                handleError(err, res, 'get-all-tasks');
            } else {
                // Transform the data to ensure consistent property names
                const transformedRows = rows.map(row => ({
                    ...row,
                    createdAt: row.created_at || row.createdAt
                }));
                
                logger.debug('All tasks retrieved for recap', { 
                    count: transformedRows.length,
                    timestamp: new Date().toISOString()
                });
                res.render('task-recap', {
                    tasklist: transformedRows,
                    pageTitle: 'Giornalino a puntini'
                });
            }
        });
    }
};

export default taskController; 