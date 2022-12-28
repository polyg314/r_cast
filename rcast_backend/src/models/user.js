const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        spotify_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },

    },{
        timestamps: true,
        
    })
    // User.prototype.validPassword = function (password) {
    //     return this.password === password
    // }

    return user
}