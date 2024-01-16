const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserGroup =sequelize.define('usergroups', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupId:{type: Sequelize.INTEGER},
    isAdmin:{type:Sequelize.BOOLEAN},
    userId: {type: Sequelize.INTEGER}
    }, 
    { timestamps: false} //disables createdat and updatedat
)

module.exports = UserGroup;