const path = require('path')
const fs = require('fs')

const fileJSONStorage = path.join(path.dirname(process.mainModule.filename), 'data', 'tasks.json')

const getTaskFromFile = cb => {
    fs.readFile(fileJSONStorage, (err, fileContent) => {
        if (err) {
            cb([])
        } else {
            console.log(fileJSONStorage.toString())
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Task {
    constructor(t) {
        this.taskText = t
    }

    save() {
        getTaskFromFile(tasks => {
            tasks.push(this)
            fs.writeFile(fileJSONStorage, JSON.stringify(tasks), err => {
                console.log(err)
            })
        })
    }

    static fetchAll(cb) {
        getTaskFromFile(cb)
    }

    static deleteByTaskText(taskText) {
        getTaskFromFile(tasksfromfile => {
            fs.writeFile(fileJSONStorage, JSON.stringify(tasksfromfile.filter(task => task.taskText !== taskText)), err => {
                console.log(err)
            })
        })
    }
}
