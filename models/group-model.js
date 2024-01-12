const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group =sequelize.define('groups', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    group:{type:Sequelize.STRING},
    admin:{type:Sequelize.INTEGER},
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = Group;