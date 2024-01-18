const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User =sequelize.define('users', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username: {type: Sequelize.STRING},
    email:{type: Sequelize.STRING},
    phonenum:{
        type:Sequelize.BIGINT
    },
    password: {type: Sequelize.STRING},
    avatar:{type: Sequelize.STRING}
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = User;