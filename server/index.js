const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io = new Server({
    cors:true,
});
const app = express();
app.use(bodyParser.json());

const emailToSocket = new Map();
const socketToEmail = new Map();

io.on('connection',(socket)=>{
    console.log('New connection');
    socket.on('join-room',(data)=>{
        const {roomId, email} = data;
        console.log(`User ${email} joined room ${roomId}`)
        emailToSocket.set(email, socket.id);
        socketToEmail.set(socket.id,email);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined', {email});
        console.log(emailToSocket);
        socket.emit('room-joined',{roomId})
    });
    //here sending the offer to the specified email id
    socket.on('offer',({email,offer})=>{
        console.log('Offer received',email);
        const socketId = emailToSocket.get(email);
        const fromEmail = socketToEmail.get(socket.id);
        socket.to(socketId).emit('incoming-offer',{fromEmail,offer});
        console.log('Offer sent to',email);
    });
    //here accepting the offer and sending the answer to the specified email id
    socket.on('offer-accepted',({email,answer})=>{
        console.log('Offer accepted',email);
        const socketId = emailToSocket.get(email);
        const fromEmail = socketToEmail.get(socket.id);
        socket.to(socketId).emit('offer-accepted',{answer});
    
    })

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });

io.listen(3001, () => {
    console.log('Socket is running on port 3001');
    });