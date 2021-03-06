const express = require('express')

const router = express.Router()

const taskController = require('../controllers/task')

router.get('/add-task', taskController.getAddTask)

router.post('/add-task', taskController.postAddTask)

router.get('/delete-task', taskController.getDeleteTask)
module.exports = router