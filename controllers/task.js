const db = require('../config/database');

exports.postAddTask = (req, res, next) => {
    if (req.query.taskText) {
        const taskText = req.query.taskText;
        db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(err) {
            if (err) {
                console.log('Error inserting task:', err);
                res.redirect('/error');
            } else {
                console.log('Inserted task:', taskText);
                res.redirect('/tasks');
            }
        });
    } else {
        console.log('No task text provided');
        res.redirect('/error');
    }
}

exports.getAddTask = (req, res, next) => {
    if (req.query.taskText) {
        const taskText = req.query.taskText;
        db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(err) {
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
}

exports.getHomeTasks = (req, res, next) => {
    db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            console.log('Error fetching tasks:', err);
            res.redirect('/error');
        } else {
            res.render('home', {
                tasklist: rows,
                pageTitle: 'Giornalino a puntini'
            });
        }
    });
}

exports.getAddTaskPage = (req, res, next) => {
    res.render('add-task');
}

exports.getAllTasks = (req, res, next) => {
    db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            console.log('Error fetching tasks:', err);
            res.redirect('/error');
        } else {
            res.render('task-recap', {
                tasklist: rows,
                pageTitle: 'Giornalino a puntini'
            });
        }
    });
}

exports.getDeleteTask = (req, res, next) => {
    const taskId = parseInt(req.query.taskId);
    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) {
            console.log('Error deleting task:', err);
        } else {
            console.log('Deleted taskId:', taskId);
        }
        res.redirect('/home');
    });
}
