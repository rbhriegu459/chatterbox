const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

const Port = process.env.PORT;

// Routes import
const userRoute = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/user', userRoute);

// sequelize.sync()
// .then(result=>{
//     app.listen(Port, ()=>{
//       console.log(`Server running on port ${Port}`);
//     })
// }) 
// .catch((err)=>{
//     console.log("Database Error setting Sequelize",err);
// });

app.listen(Port);