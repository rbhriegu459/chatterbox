const path = require('path');
const Chat = require('../models/chat-model');

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

module.exports = {getChat, postChat};