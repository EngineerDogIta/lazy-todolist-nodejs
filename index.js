const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const APP_PORT = 3000
const tasks = []

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

app.use('/', (req, res, next) => {
    res.render('home', {
        tasklist: tasks,
        pageTitle: 'Giornalino a puntini'
    })
})

app.use(function (req, res, next) {
    return res.status(404).render('error')
})

app.listen(APP_PORT)
