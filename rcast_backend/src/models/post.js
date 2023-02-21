const { DataTypes } = require("sequelize")
const sequelize = require('../db/db');

module.exports = function(sequelize, Sequelize) {
    const post = sequelize.define('post', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        postSourceId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        postUserComment: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        postType: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        postImage: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        postTitle: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        postArtist: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        postLength: {
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

    return post
}