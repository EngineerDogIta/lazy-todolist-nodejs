import express from 'express';
import taskController from '../controllers/task';

const router = express.Router();

router.get('/', taskController.getHomeTasks);
router.get('/add-task', taskController.getAddTaskPage);
router.post('/', taskController.postAddTask);

export default router; 