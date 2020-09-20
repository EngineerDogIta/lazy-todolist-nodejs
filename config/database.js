var pg = require('pg');
const { Sequelize } = require('sequelize');

pg.defaults.ssl = true;

var sequelize;

if (process.env.DATABASE_URL) {
    console.log('connecting to postgres');
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    console.log('sqlite local db');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './data/database.sqlite'
    });
}

module.exports = sequelize;
