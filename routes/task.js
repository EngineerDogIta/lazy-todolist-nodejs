
const express = require('express')

const taskController = require('../controllers/task')

const router = express.Router()

router.get('/home', taskController.getHomeTasks)
router.get('/add-a-task', taskController.getAddTaskPage)
router.get('/tasks', taskController.getAllTasks)

module.exports = router