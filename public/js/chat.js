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




const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a') //chk moment,js docs for further formats and details.
    })
    $messages.insertAdjacentHTML('beforeend', html)
});

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