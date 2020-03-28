const Task = require('../models/Task')

exports.postAddTask = (req, res, next) => {
    Task.fetchAll(tasks => {
        res.render('home', {
            tasklist: tasks,
            pageTitle: 'Giornalino a puntini'
        })
    })
}

exports.getAddTask = (req, res, next) => {
    Task.fetchAll(tasks => {
        res.render('home', {
            tasklist: tasks,
            pageTitle: 'Giornalino a puntini'
        })
    })
}

exports.getHomeTasks = (req, res, next) => {
    Task.fetchAll(tasks => {
        res.render('home', {
            tasklist: tasks,
            pageTitle: 'Giornalino a puntini'
        })
    })
}
