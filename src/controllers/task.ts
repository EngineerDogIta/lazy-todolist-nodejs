import { Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.config';
import { Task } from '../models/Task';
import logger from '../config/logger';

const taskRepository = AppDataSource.getRepository(Task);

const MAX_DEPTH_ERROR = 'Maximum task depth exceeded';
const INVALID_ID_ERROR = 'Invalid task ID';
const TASK_NOT_FOUND_ERROR = 'Task not found';
const MISSING_FIELDS_ERROR = 'Missing required fields';
const PARENT_NOT_FOUND_ERROR = 'Parent task not found';

const handleError = async (err: Error, res: Response, context: string): Promise<void> => {
    logger.error('Error occurred:', { 
        error: err.message, 
        stack: err.stack,
        context,
        timestamp: new Date().toISOString()
    });

    if (err.message === MAX_DEPTH_ERROR) {
        try {
            const tasks = await taskRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.childTasks', 'childTasks')
                .leftJoinAndSelect('childTasks.childTasks', 'grandChildTasks')
                .leftJoinAndSelect('grandChildTasks.childTasks', 'greatGrandChildTasks')
                .leftJoinAndSelect('task.parentTask', 'parentTask')
                .where('task.parentTask IS NULL')
                .orderBy('task.createdAt', 'DESC')
                .getMany();

            res.render('home', {
                tasklist: tasks,
                error: MAX_DEPTH_ERROR,
                pageTitle: 'Giornalino a puntini'
            });
        } catch (loadError) {
            logger.error('Failed to load tasks for error page:', {
                error: loadError instanceof Error ? loadError.message : String(loadError),
                context: 'error-page-task-load'
            });
            res.redirect('/');
        }
        return;
    }

    res.redirect('/error');
};

const taskController = {
    postAddTask: async (req: Request, res: Response): Promise<void> => {
        try {
            // Handle delete action
            if (req.body.action === 'delete' && req.body.taskId) {
                const taskId = parseInt(req.body.taskId);
                if (isNaN(taskId)) {
                    throw new Error(INVALID_ID_ERROR);
                }
                
                // First find the task to delete
                const taskToDelete = await taskRepository.findOne({
                    where: { id: taskId },
                    relations: ['childTasks']
                });
                
                if (!taskToDelete) {
                    throw new Error(TASK_NOT_FOUND_ERROR);
                }
                
                // Delete the task and wait for it to complete
                await taskRepository.remove(taskToDelete);
                
                logger.info('Task deleted successfully', { 
                    taskId,
                    timestamp: new Date().toISOString()
                });
                
                // Send a JSON response for AJAX requests
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    res.json({ success: true });
                } else {
                    res.redirect('/');
                }
                return;
            }

            // Handle toggle completion action
            if (req.body.action === 'toggle-completion' && req.body.taskId) {
                const taskId = parseInt(req.body.taskId);
                if (isNaN(taskId)) {
                    throw new Error(INVALID_ID_ERROR);
                }

                const task = await taskRepository.findOne({
                    where: { id: taskId }
                });

                if (!task) {
                    throw new Error(TASK_NOT_FOUND_ERROR);
                }

                task.isCompleted = !task.isCompleted;
                await taskRepository.save(task);

                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    res.json({ success: true });
                } else {
                    res.redirect('/');
                }
                return;
            }

            // Handle add subtask action
            if (req.body.action === 'add-subtask') {
                const { taskText, parentId } = req.body;
                if (!taskText || !parentId) {
                    throw new Error(MISSING_FIELDS_ERROR);
                }

                const parentTask = await taskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.parentTask', 'parent')
                    .leftJoinAndSelect('parent.parentTask', 'grandparent')
                    .leftJoinAndSelect('grandparent.parentTask', 'greatgrandparent')
                    .where('task.id = :id', { id: parseInt(parentId) })
                    .getOne();

                if (!parentTask) {
                    throw new Error(PARENT_NOT_FOUND_ERROR);
                }

                // Calculate actual depth by counting parents
                let currentTask = parentTask;
                let depth = 1; // Start at 1 since this will be a child
                while (currentTask.parentTask) {
                    depth++;
                    currentTask = currentTask.parentTask;
                }

                if (depth >= 4) {
                    logger.error('Attempted to exceed maximum task depth', {
                        parentTaskId: parentId, 
                        calculatedDepth: depth,
                        timestamp: new Date().toISOString()
                    });
                    throw new Error(MAX_DEPTH_ERROR);
                }

                const task = new Task();
                task.title = taskText;
                task.parentTask = parentTask;
                task.depth = depth;
                await taskRepository.save(task);

                logger.info('Subtask created successfully', { 
                    taskText,
                    parentId,
                    taskId: task.id,
                    depth: depth,
                    timestamp: new Date().toISOString()
                });
                res.redirect('/');
                return;
            }

            // Handle regular task creation
            const taskText = req.body.taskText;
            if (!taskText) {
                logger.warn('Task creation attempted without text', {
                    timestamp: new Date().toISOString()
                });
                return res.redirect('/');
            }

            const task = new Task();
            task.title = taskText;
            task.depth = 0;
            await taskRepository.save(task);
            
            logger.info('Task created successfully', { 
                taskText,
                taskId: task.id,
                timestamp: new Date().toISOString()
            });
            res.redirect('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                await handleError(err, res, 'create-task');
            } else {
                logger.error('Unknown error occurred', { 
                    err,
                    context: 'create-task',
                    timestamp: new Date().toISOString()
                });
                res.redirect('/error');
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                handleError(err, res, 'get-add-task');
            } else {
                logger.error('Unknown error occurred', {
                    err, 
                    context: 'get-add-task',
                    timestamp: new Date().toISOString()  
                });
                res.redirect('/error');
            }
        }
    },

    getHomeTasks: async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await taskRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.childTasks', 'childTasks')
                .leftJoinAndSelect('childTasks.childTasks', 'grandChildTasks')
                .leftJoinAndSelect('grandChildTasks.childTasks', 'greatGrandChildTasks')
                .leftJoinAndSelect('task.parentTask', 'parentTask')
                .where('task.parentTask IS NULL')
                .orderBy('task.createdAt', 'DESC')
                .getMany();
            
            logger.debug('Tasks retrieved for home page', { 
                count: tasks.length,
                timestamp: new Date().toISOString()
            });

            // Get error message from query params if it exists
            const error = req.query.error ? decodeURIComponent(req.query.error as string) : null;

            res.render('home', {
                tasklist: tasks,
                pageTitle: 'Giornalino a puntini',
                error: error
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