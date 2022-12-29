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
            unique: true
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },

    },{
        timestamps: true,
        
    })
    // User.prototype.validPassword = function (password) {
    //     return this.password === password
    // }

    return user
}