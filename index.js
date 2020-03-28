const express = require('express')

const errorRouter = require('./routes/error')
const adminRoutes = require('./routes/admin')
const taskRoutes = require('./routes/task')

const APP_PORT = 3000

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')


app.use('/wp', errorRouter.getWPage)

app.use('/admin', adminRoutes)
app.use(taskRoutes)

app.use(errorRouter.getErrorPage)

app.listen(APP_PORT)
