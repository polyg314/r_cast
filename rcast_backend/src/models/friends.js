const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const friendship = sequelize.define('friendship', {
        friendship_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id_one: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        user_id_two: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
    },{
        timestamps: true,
        
    })
    return friendship
}