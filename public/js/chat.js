const socket = io()

// socket.on('countupdated', (count)=>{
//     console.log('the socket is now on web ' , count)
// });

// document.querySelector('#inc').addEventListener('click' , ()=>{
//     console.log("clicked")
//     socket.emit('inc')
// })

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendmsg',message)
})