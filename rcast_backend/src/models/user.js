const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        tokens: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            unique: false
        } 
        // password: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        //     notEmpty: true,
        // },
    },{
        timestamps: false,
        
    })
    // User.prototype.validPassword = function (password) {
    //     return this.password === password
    // }

    return User
}