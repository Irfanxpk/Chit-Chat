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

const { genarateMessage, genarateLocationMessage } = require('./utils/message')
const { addUser, removeUser, getUser, getUsersinRoom } = require('./utils/users')

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

    socket.on('join', (options, callback) => {

        const { error, user } = addUser({ id: socket.id, ...options })


        if (error)
        {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', genarateMessage("Admin", 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', genarateMessage('Admin', `${user.username} has joined!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersinRoom(user.room)
        })

        callback()

    })


    socket.on('sendmsg', (message, callback) => {

        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message))
        {
            return callback('Bad Usage of word are not allowded')
        }

        io.to(user.room).emit('message', genarateMessage(user.username, message))
        callback('')
    });

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user)
        {

            io.to(user.room).emit('message', genarateMessage('Admin', `${user.username} Just left`));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersinRoom(user.room)
            })

        }


    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', genarateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    })
})


server.listen(port, () => {
    console.log(`Server is up on port http://localhost:3000/ `)
})