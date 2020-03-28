
const express = require('express')

const taskController = require('../controllers/task')

const router = express.Router()

router.get('/home', taskController.getHomeTasks)

module.exports = router