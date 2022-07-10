const express = require('express');
const path = require('path');

const errorRouter = require('./routes/error');
const adminRoutes = require('./routes/admin');
const taskRoutes = require('./routes/task');

const port = process.env.PORT || 8080;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(taskRoutes);
app.use('/wp', errorRouter.getWPage);
app.use('/admin', adminRoutes);
app.use(errorRouter.getErrorPage);

//console.log(result);
app.listen(port);
