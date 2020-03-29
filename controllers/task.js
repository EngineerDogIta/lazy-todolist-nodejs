const Task = require('../models/Task')

exports.postAddTask = (req, res, next) => {
    const newTask = new Task(res.body.taskText)
    newTask.save()
    res.redirect('/tasks')
}

exports.getAddTask = (req, res, next) => {
    const newTask = new Task(req.query.taskText)
    newTask.save()
    res.redirect('/tasks')
}

exports.getHomeTasks = (req, res, next) => {
    Task.fetchAll(tasks => {
        res.render('home', {
            tasklist: tasks,
            pageTitle: 'Giornalino a puntini'
        })
    })
}

exports.getAddTaskPage = (req, res, next) => {
    res.render('add-task')
}

exports.getAllTasks = (req, res, next) => {
    Task.fetchAll(tasks => {
        res.render('task-recap', {
            tasklist: tasks,
            pageTitle: 'Tutti i compiti'
        })
    })
}

exports.getDeleteTask = (req, res, next) => {
    Task.deleteByTaskText(req.query.taskText)
    res.redirect('/tasks')
}