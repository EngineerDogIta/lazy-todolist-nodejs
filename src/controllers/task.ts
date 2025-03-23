import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { Task } from '../entities/Task';
import logger from '../config/logger';

const taskRepository = AppDataSource.getRepository(Task);

const handleError = (err: Error, res: Response, context: string): void => {
    logger.error('Error occurred:', { 
        error: err.message, 
        stack: err.stack,
        context,
        timestamp: new Date().toISOString()
    });
    res.redirect('/');
};

const taskController = {
    postAddTask: async (req: Request, res: Response): Promise<void> => {
        try {
            // Handle delete action
            if (req.body.action === 'delete' && req.body.taskId) {
                const taskId = parseInt(req.body.taskId);
                if (isNaN(taskId)) {
                    throw new Error('Invalid task ID');
                }
                await taskRepository.delete(taskId);
                logger.info('Task deleted successfully', { 
                    taskId,
                    timestamp: new Date().toISOString()
                });
                res.redirect('/');
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

            const task = new Task();
            task.title = taskText;
            await taskRepository.save(task);
            
            logger.info('Task created successfully', { 
                taskText,
                taskId: task.id,
                timestamp: new Date().toISOString()
            });
            res.redirect('/');
        } catch (err) {
            if (err instanceof Error) {
                handleError(err, res, 'create-task');
            }
        }
    },

    getAddTask: async (req: Request, res: Response): Promise<void> => {
        try {
            if (req.query.taskText) {
                const taskText = req.query.taskText as string;
                const task = new Task();
                task.title = taskText;
                await taskRepository.save(task);
                
                logger.info('Task created successfully via GET', { 
                    taskText,
                    taskId: task.id,
                    timestamp: new Date().toISOString()
                });
                res.redirect('/');
            } else {
                logger.warn('GET request attempted without task text', {
                    timestamp: new Date().toISOString()
                });
                res.redirect('/error');
            }
        } catch (err) {
            if (err instanceof Error) {
                handleError(err, res, 'get-add-task');
            }
        }
    },

    getHomeTasks: async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await taskRepository.find({
                order: {
                    createdAt: 'DESC'
                }
            });
            
            logger.debug('Tasks retrieved for home page', { 
                count: tasks.length,
                timestamp: new Date().toISOString()
            });
            res.render('home', {
                tasklist: tasks,
                pageTitle: 'Giornalino a puntini'
            });
        } catch (err) {
            if (err instanceof Error) {
                handleError(err, res, 'get-home-tasks');
            }
        }
    },

    getAllTasks: async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await taskRepository.find({
                order: {
                    createdAt: 'DESC'
                }
            });
            
            logger.debug('All tasks retrieved for recap', { 
                count: tasks.length,
                timestamp: new Date().toISOString()
            });
            res.render('task-recap', {
                tasklist: tasks,
                pageTitle: 'Giornalino a puntini'
            });
        } catch (err) {
            if (err instanceof Error) {
                handleError(err, res, 'get-all-tasks');
            }
        }
    }
};

export default taskController; 