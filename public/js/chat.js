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
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendmsg', message, (error) => {
        if(error){
            return console.log(error)
        }

        console.log("messsage delevered")
    })
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
    {
        return alert('Location Feature is not supported in you browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            console.log('Location Shared!')
        })
    })
})