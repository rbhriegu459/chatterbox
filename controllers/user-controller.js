const path = require('path');
const User = require('../models/user-model');
const bcrypt=  require('bcrypt');

const getSignUp = async (req,res)=>{
    res.sendFile(path.join(__dirname,'..', 'views', 'signup.html'))
}

const postSignUp = async (req,res) => {
    try{
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({where:{email:email}});
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        if(existingUser){
            res.status(201).json("User Exists");
        }
        else{
            const newUser = await User.create({username, email, password:hashedPassword});
            res.status(204).json("User Created");
        }
    }
    catch (err) {
        console.error("Signup failed", err);
        res.status(500).json({"Signup failed" : err});
    }
}

const getLogin = async (req,res)=>{
    res.sendFile(path.join(__dirname,'..', 'views', 'login.html'))
}

const postLogin = async (req,res) => {

}

module.exports = {getSignUp, postSignUp, getLogin, postLogin};