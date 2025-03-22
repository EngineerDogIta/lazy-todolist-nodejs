const db = require('../config/database');

const handleError = (err, res) => {
    console.log('Error:', err);
    res.redirect('/');
};

exports.postAddTask = (req, res, next) => {
    const taskText = req.body.taskText;
    if (!taskText) {
        console.log('No task text provided');
        return res.redirect('/');
    }

    db.run('INSERT INTO tasks (title) VALUES (?)', [taskText], function(err) {
        if (err) {
            handleError(err, res);
        } else {
            console.log('Inserted task:', taskText);
            res.redirect('/');
        }
    });
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

exports.getAddTaskPage = (req, res, next) => {
    res.render('add-task', {
        pageTitle: 'Aggiungi compito'
    });
}

exports.getHomeTasks = (req, res, next) => {
    db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            handleError(err, res);
        } else {
            res.render('home', {
                tasklist: rows,
                pageTitle: 'Giornalino a puntini'
            });
        }
    });
}

exports.getAllTasks = (req, res, next) => {
    db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            handleError(err, res);
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
    if (isNaN(taskId)) {
        return handleError(new Error('Invalid task ID'), res);
    }

    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) {
            handleError(err, res);
        } else {
            console.log('Deleted taskId:', taskId);
            res.redirect('/');
        }
    });
}
