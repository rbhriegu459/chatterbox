const path = require('path');
const Chat = require('../models/chat-model');
const User = require('../models/user-model');

const getChat =  async (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'));
}

const postChat = async (req,res) => {
    const chat  =req.body.chat;
    const userId = req.user.id;
    try{
        const addChat = await Chat.create({userId, chat});
        res.status(201).json("Added");
    }
    catch(err){
        console.log(err);
        res.status(401).json("Failed to add Chat");
    }
}


const fetchChat = async (req,res) => {
    try{
        const chatsFromDb =  await Chat.findAll();
        res.status(201).json({chatsFromDb,success:true});
    }
    catch(err){
        console.log(err);
        res.status(401).json("Failed to fetch Chat");
    }
}

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
module.exports = {getChat, postChat, fetchChat, getName};