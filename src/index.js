const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));


// io.on('connection',(socket)=>{
//     console.log('new Websocket connection')
//     socket.emit('countupdated' , count)
//     socket.on('inc',()=>{
//         count++;
//         // socket.emit('countupdated',count)   this will only update the clicked client for update in all client we use io.emit u can see in next line.
//         io.emit('countupdated',count) // this will send the count to the every connected client
//     })

// })



io.on("connection", (socket) => {
    console.log("New Connection here!!!");

    socket.emit('message', "Welcome!!");

    socket.broadcast.emit('message', "A new user Joined");

    socket.on('sendmsg', (message, callback) => {

        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Bad Usage of word are not allowded')
        }

        io.emit('message', message)
        callback('')
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A User Just left')
    })

    socket.on('sendLocation', (coords , callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback()
    })
})


server.listen(port, () => {
    console.log(`Server is up on port http://localhost:3000/ `)
})