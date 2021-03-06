
const { Sequelize } = require('sequelize');
var env = process.env.NODE_ENV;
var sequelize;

// if (env === 'production') {
if (env) {
    console.log('hosting on heroku using postgres');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    })
} else {
    console.log('localhost using sqlite');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './data/database.sqlite'
    });
}



module.exports = sequelize;
