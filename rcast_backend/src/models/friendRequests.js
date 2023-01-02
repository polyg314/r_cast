const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const friendRequest = sequelize.define('friend_request', {
        friend_request_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_requesting: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        user_requested: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        request_status: {
            type: DataTypes.STRING, // ACTIVE, ACCEPTED, DENIED
            allowNull: false, 
            uniqu: false
        }
    },{
        timestamps: true,
        
    })
    // User.prototype.validPassword = function (password) {
    //     return this.password === password
    // }

    return friendRequest
}