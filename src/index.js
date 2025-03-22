const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const taskRoutes = require('./routes/task');

const port = process.env.PORT || 8080;

const app = express();

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'components/public')));

// Routes
app.use('/', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
