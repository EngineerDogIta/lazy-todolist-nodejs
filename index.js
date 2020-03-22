const express = require('express')
const APP_PORT = 3000

const errorController = require('../controllers/error.js')

const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

const adminData = require('./routes/admin');
const taskRoutes = require('./routes/task');

app.use('/admin', adminData.routes);
app.use(taskRoutes);

app.use(errorController.get404)

app.listen(APP_PORT)
