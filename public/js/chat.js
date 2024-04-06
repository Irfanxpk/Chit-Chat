const socket = io()

// socket.on('countupdated', (count)=>{
//     console.log('the socket is now on web ' , count)
// });

// document.querySelector('#inc').addEventListener('click' , ()=>{
//     console.log("clicked")
//     socket.emit('inc')
// })

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button')
const $sendlocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML



const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


//
const query = Qs.parse(location.search,{ ignoreQueryPrefix: true })
let {username , room} = query


const autoscroll = () =>{
        //New message element
        const $newMessage = $messages.lastElementChild

        // Heigth of the new message
        const newMessageStyles = getComputedStyle($newMessage);
        const newMessageMargin = parseInt(newMessageStyles.marginBottom);
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

        const visibleHeight = $messages.offsetHeight;

        //Height of message container
        const containerHeight = $messages.scrollHeight

        //How far have i scrolled.
        const scrollOffset = $messages.scrollTop + visibleHeight

        if(containerHeight - newMessageHeight <= scrollOffset){
            $messages.scrollTop= $messages.scrollHeight;
        }
        console.log(newMessageMargin)
}


socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        username:msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a') //chk moment,js docs for further formats and details.
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
});

socket.on('roomData',({room , users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')


    const message = e.target.elements.message.value

    socket.emit('sendmsg', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error)
        {
            return console.log(error)
        }

        console.log("messsage delevered")
    })
});

$sendlocationButton.addEventListener('click', () => {
    if (!navigator.geolocation)
    {
        return alert('Location Feature is not supported in you browser')
    }
    $sendlocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendlocationButton.removeAttribute('disabled');
            console.log('Location Shared!')
        })
    })
})
socket.emit('join',{username , room },(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})