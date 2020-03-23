const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const errorRouter = require('./routes/error.js')

const APP_PORT = 3000
const tasks = []

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

app.use('/wp', errorRouter.getWPage)

app.use('/home', (req, res, next) => {
    res.render('home', {
        tasklist: tasks,
        pageTitle: 'Giornalino a puntini'
    })
})

app.use(errorRouter.getErrorPage)

app.listen(APP_PORT)
