const express = require('express');
const Sequelize = require('./util/database');
const bodyParser = require("body-parser");
const app = express();
const http = require('http').createServer(app);

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Routes import
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/user', userRoute);
app.use('/chat', chatRoute);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
})

Sequelize.sync()
    .then(result=>{
        http.listen(PORT, ()=>{
            console.log(`Listening on PORT ${PORT}`);
        });
    }) 
    .catch((err)=>{
        console.log("Database Error setting Sequelize",err);
    });

// http.listen(PORT, ()=>{
//     console.log(`Listening on PORT ${PORT}`);
// });

// socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("connected..");
    socket.on('message', (msg, name)=>{
        socket.broadcast.emit('message', msg, name);
    })
})
