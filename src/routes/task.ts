import express from 'express';
import taskController from '../controllers/task';

const router = express.Router();

router.get('/', taskController.getHomeTasks);
router.post('/', taskController.postAddTask);
router.post('/generate-tasks', taskController.generateTasks);
router.get('/random-prompt', taskController.getRandomPrompt);

export default router; 