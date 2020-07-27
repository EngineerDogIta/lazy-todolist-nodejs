const Task = require('../models/Task')

exports.postAddTask = (req, res, next) => {
    // const newTask = new Task(res.body.taskText);
    Task.create({
        title: req.query.taskText
    }).then(result=> {
        console.log('inserted task', taskText);
        res.redirect('/tasks')
    }).catch(error => { 
        console.log('got error', error);
    });
}

exports.getAddTask = (req, res, next) => {
    // const newTask = new Task(req.query.taskText);
    const newTask = Task.create({
        title: req.query.taskText
    }).then(result => {
        console.log('inserted newTask id:', newTask.id);
    }).catch(error => {
        console.log('Found error', error);
    }).finally(onfinally => {
        res.redirect('/home');
    });
}

exports.getHomeTasks = (req, res, next) => {
    Task.findAll().then(result => {
        console.log("All tasks:", JSON.stringify(result, null, 2));
        res.render('home', {
            tasklist: result,
            pageTitle: 'Giornalino a puntini'
        });
    }).catch(error => {
        console.log('Got error', error);
    });
    
}

exports.getAddTaskPage = (req, res, next) => {
    res.render('add-task')
}

exports.getAllTasks = (req, res, next) => {
    Task.findAll().then(result => {
        console.log("All tasks:", JSON.stringify(result, null, 2));
        res.render('task-recap', {
            tasklist: result,
            pageTitle: 'Giornalino a puntini'
        });
    }).catch(error => {
        console.log('Got and error', error);
    });
    
    
}

exports.getDeleteTask = (req, res, next) => {
    Task.destroy({
        where: {
            title: req.query.taskText
        }
    });
    res.redirect('/tasks');
}
