const path = require('path');
const Chat = require('../models/chat-model');
const User = require('../models/user-model');
const Group = require('../models/group-model');
const UserGroup = require('../models/usergroup-model');

const getChat =  async (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'));
}

const addGroup = async (req,res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'addGroup.html'));
}

const createGroupInDb  = async (req,res) =>{
    try{
        const groupDetails = { group: req.body.group, admin: req.body.admin};
        const grp = await Group.create(groupDetails);
        const userGroupDetails= {
            groupId: grp.id,
            isAdmin:true,
            userId: grp.admin
        };
        await UserGroup.create(userGroupDetails);
        res.status(200).json({message : "Group Created", success:true});
    }
    catch(err){
        console.log(err);
        res.status(401).json({message : "Failed Creating Group", success:false});
    }
}

// --- Fetching groups to show in UI ----
const fetchGroups = async (req,res) =>{
    try{
        const userGroups = await UserGroup.findAll({where: {userId :req.params.id}});
        res.status(201).json({userGroups, success:true});
    }
    catch(err){
        console.log(err);
        res.status(401).json({err : "Group not found"});
    }
}

// ---In above function you get groupId, so now fetching group name
const fetchGroupName = async (req,res)=>{
    try{
        const groupName = await Group.findOne({where: {id: req.params.id}});
        res.status(201).json({groupName});
    }
    catch(err){
        console.log(err);
        res.status(401).json("Group not found");
    }
}


// --------POSTING CHATS TO DATABASE----
const postChat = async (req,res) => {
    const chat  =req.body.chat;
    const userId = req.user.id;
    const groupName = req.body.groupName;
    try{
        const addChat = await Chat.create({userId, chat, groupName});
        res.status(201).json("Added");
    }
    catch(err){
        console.log(err);
        res.status(401).json("Failed to add Chat");
    }
}

// ----Getting all the chats from database as per the groups---
const groupchats = async (req,res) => {
    const groupName= req.params.name;
    try{
        const response = await Chat.findAll({where:{groupName:groupName}});
        res.status(201).json({response});
    } catch(err){
        console.log(err);
        res.status(401).json({err});
    }
}

// --- Getting username to show in the chat----
const getName  = async (req,res) => {
    try{
        const userId = req.params.id;
        const n = await User.findOne( {where:{id: userId}, attributes:['username']});
        res.status(201).json({n, success:true});
    }
    catch(err){
        console.log(err);
        res.status(401).json("Failed to fetch name");
    }
}

// ---All users--
const allUsers = async (req,res) => {
    try{
        const users = await User.findAll();
        res.status(201).json({users});
    } catch(err){
        console.log(err);
        res.status(401).json({err});
    }
}

// ---getting group id---
const grpId = async (req,res) => {
    const x = await Group.findOne({where:{group:req.params.name}});
    res.status(201).json({x});
}

// ---adding group of user
const addUserToGroup = async (req,res) => {
    console.log(req.body);
    try{
        const adding = await UserGroup.create(req.body);
        res.status(201).json("User Added to the group");
    }catch(err){
        console.log(err);
        res.status(401).json({err});
    }
}


// Exit chat
const exitChat = async function(req,res){
    const group = req.params.grp;
    const userId = req.params.id;
    try{
        console.log("group", group, "userid>>", userId);
        const adminRes = await Group.findOne({where:{group:group}});
        const groupId = adminRes.dataValues.id;
        
        const response = await UserGroup.findOne({where: {userId:userId, groupId:groupId}});
        if(response){
            await response.destroy();
        }

        // console.log(adminRes.dataValues.admin);
        // if(response.isAdmin === 1){
        //     await adminRes.destroy();
        // }
        res.status(200).json({success:true, "message":"User left"});
    }catch(err){
        console.log(err);
        
        res.status(500).json({success:false,error:err});
    }
}

const getAvatar =  async (req,res) => {
    try{
        const userId = req.params.id;
        const getUser = await User.findOne({where:{id:userId}});
        res.status(200).json({getUser});
    }catch(err){
        console.log(err);
        res.status(500).json({err});
    }
}

module.exports = {getChat, postChat, groupchats, getName, addGroup, createGroupInDb, fetchGroups, fetchGroupName, allUsers, addUserToGroup, grpId, exitChat, getAvatar};