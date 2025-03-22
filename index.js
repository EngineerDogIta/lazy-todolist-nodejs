const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const errorRouter = require('./routes/error');
const adminRoutes = require('./routes/admin');
const taskRoutes = require('./routes/task');

const port = process.env.PORT || 8080;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

// Add body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', taskRoutes);
app.use('/admin', adminRoutes);
app.use(errorRouter.getErrorPage);

//console.log(result);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
