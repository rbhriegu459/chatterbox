const express = require('express');
const sequelize = require('sequelize');
const socketIo = require('socket.io');
const http = require('http');
const bodyParser = require("body-parser");
const app = express();

require('dotenv').config();

const Port = process.env.PORT;

// Routes import
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/user', userRoute);
app.use('/chat', chatRoute);

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