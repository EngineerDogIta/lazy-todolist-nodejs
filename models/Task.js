const path = require('path')
const fs = require('fs')

const fileJSONStorage = path.join(path.dirname(process.mainModule.filename), 'data', 'tasks.json')

const getTaskFromFile = cb => {
    fs.readFile(fileJSONStorage, (err, fileContent) => {
        if (err) {
            cb([])
        } else {
            cb(JSON.parse(fileContent))
        }
    })
}

const errHandler = error => {
    if (err == null) {
        console.log('tasks.json Saved')
    } else {
        console.log(err)
    }
}

module.exports = class Task {
    constructor(t) {
        this.taskText = t
    }

    save() {
        getTaskFromFile(tasks => {
            tasks.push(this)
            fs.writeFile(fileJSONStorage, JSON.stringify(tasks), errHandler)
        })
    }

    static fetchAll(cb) {
        getTaskFromFile(cb)
    }

    static deleteByTaskText(taskText) {
        getTaskFromFile(tasksfromfile => {
            fs.writeFile(fileJSONStorage, JSON.stringify(tasksfromfile.filter(task => task.taskText !== taskText)), errHandler)
        })
    }
}
