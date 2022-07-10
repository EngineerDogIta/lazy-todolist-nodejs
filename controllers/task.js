const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();

exports.postAddTask = (req, res, next) => {
    if (req.query.taskText) {
        let taskToCreate = Prisma.TaskCreateInput;

        taskToCreate = {
            title: req.query.taskText
        }

        prisma.task.create({
            data: taskToCreate
        }).then(res => {
            console.log('inserted task', taskText);
            res.redirect('/tasks');
        }).catch(err => {
            console.log('got error', error);
            res.redirect('/error');
        })
    } else { 
        console.log('got error', error);
        res.redirect('/error');
    }
}

exports.getAddTask = (req, res, next) => {
    // const newTask = new Task(req.query.taskText);
    const newTask = prisma.tasks.create({
        data: {
            title: req.query.taskText
        }
    }).then(result => {
        console.log('inserted newTask id:', result);
    }).catch(error => {
        console.log('Found error', error);
    }).finally(onfinally => {
        res.redirect('/home');
    });
}

exports.getHomeTasks = (req, res, next) => {
    prisma.tasks.findMany().then(result => {
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
    prisma.tasks.findMany().then(result => {
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
    // convert req.query.taskId to int
    let taskId = parseInt(req.query.taskId);
    prisma.tasks.delete({
        where: {
            id: taskId
        }
    }).then(result => {
        console.log('Deleted taskId:', req.query.taskId);
        res.redirect('/home');
    }).catch(error => console.log('Got error deleting ', req.query.taskText, error));
}
