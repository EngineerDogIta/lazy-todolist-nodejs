const path = require('path')
const fs = require('fs')

const p = path.join(__dirname, '/../', 'data', 'tasks.json')

const getTaskFromFile = cb => {
    fs.readFile(p, (err, fileContent) =>{
        if (err) {
            cb([])
        } else {
            console.log(__dirname)
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Task {
    constructor(t) {
        this.title = t
    }

    save() {
        getTaskFromFile(tasks => {
            tasks.push(this)
            fs.writeFile(p, stringify(products), err => {
                console.log(err)
            })
        })
    }

    static fetchAll(cb) {
        getTaskFromFile(cb)
    }
}