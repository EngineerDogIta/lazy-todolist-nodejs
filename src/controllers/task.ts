import { Request, Response, NextFunction } from 'express';
import db from '../config/database';

interface Task {
    id: number;
    title: string;
    createdAt: string;
}

const handleError = (err: Error, res: Response): void => {
    console.log('Error:', err);
    res.redirect('/');
};

const taskController = {
    postAddTask: (req: Request, res: Response, next: NextFunction): void => {
        const taskText = req.body.taskText;
        if (!taskText) {
            console.log('No task text provided');
            return res.redirect('/');
        }

        db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(err: Error | null) {
            if (err) {
                handleError(err, res);
            } else {
                console.log('Inserted task:', taskText);
                res.redirect('/');
            }
        });
    },

    getAddTask: (req: Request, res: Response, next: NextFunction): void => {
        if (req.query.taskText) {
            const taskText = req.query.taskText as string;
            db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(err: Error | null) {
                if (err) {
                    console.log('Error inserting task:', err);
                    res.redirect('/error');
                } else {
                    console.log('Inserted task:', taskText);
                    res.redirect('/home');
                }
            });
        } else {
            res.redirect('/error');
        }
    },

    getAddTaskPage: (req: Request, res: Response, next: NextFunction): void => {
        res.render('add-task', {
            pageTitle: 'Aggiungi compito'
        });
    },

    getHomeTasks: (req: Request, res: Response, next: NextFunction): void => {
        db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err: Error | null, rows: Task[]) => {
            if (err) {
                handleError(err, res);
            } else {
                res.render('home', {
                    tasklist: rows,
                    pageTitle: 'Giornalino a puntini'
                });
            }
        });
    },

    getAllTasks: (req: Request, res: Response, next: NextFunction): void => {
        db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err: Error | null, rows: Task[]) => {
            if (err) {
                handleError(err, res);
            } else {
                res.render('task-recap', {
                    tasklist: rows,
                    pageTitle: 'Giornalino a puntini'
                });
            }
        });
    },

    getDeleteTask: (req: Request, res: Response, next: NextFunction): void => {
        const taskId = parseInt(req.query.taskId as string);
        if (isNaN(taskId)) {
            return handleError(new Error('Invalid task ID'), res);
        }

        db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err: Error | null) {
            if (err) {
                handleError(err, res);
            } else {
                console.log('Deleted taskId:', taskId);
                res.redirect('/');
            }
        });
    }
};

export default taskController; 