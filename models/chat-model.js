const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat =sequelize.define('chats', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER
    },
    chat:{
        type:Sequelize.STRING,
    }},
    { timestamps: false} //disables createdat and updatedat
)

module.exports = Chat;