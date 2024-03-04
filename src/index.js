const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

const app = express();
const  server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath));

let count = 0;


// io.on('connection',(socket)=>{
//     console.log('new Websocket connection')
//     socket.emit('countupdated' , count)
//     socket.on('inc',()=>{
//         count++;
//         // socket.emit('countupdated',count)   this will only update the clicked client for update in all client we use io.emit u can see in next line.
//         io.emit('countupdated',count) // this will send the count to the every connected client
//     })

// })

io.on("connection",(socket)=>{
    console.log("New Connection here!!!");

    socket.emit('message',"Welcome!!")
    
    socket.on('sendmsg',(message)=>{
        io.emit('message' , message)
    })
})

server.listen(port , ()=>{
    console.log(`Server is up on port http://localhost:3000/ `)
})