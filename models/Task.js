const {
    Sequelize,
    DataTypes
} = require('sequelize');

const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Altre opzioni
});

module.exports = Task;
