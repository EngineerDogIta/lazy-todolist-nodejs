var pg = require('pg');
pg.defaults.ssl = true;

const {
    Sequelize
} = require('sequelize');

var sequelize;

if (process.env.DATABASE_URL) {
    console.log('connecting to postgres');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        ssl: true,
        
    });    
} else {
    console.log('sqlite local db');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './data/database.sqlite'
    });
}

module.exports = sequelize;
