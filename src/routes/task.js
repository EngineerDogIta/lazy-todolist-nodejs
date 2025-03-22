const express = require('express')

const taskController = require('../controllers/task')

const router = express.Router()

router.get('/', taskController.getHomeTasks)
router.get('/add-task', taskController.getAddTaskPage)
router.post('/', taskController.postAddTask)

module.exports = router