const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const PostComment = sequelize.define('PostComment', {
        postCommentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        postCommentText: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    },{
        timestamps: true,        
    })
    return PostComment
}