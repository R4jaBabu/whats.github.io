const socket = io('http://localhost:8000');

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on recieving message
const audio = new Audio('message_tone.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// if a new user joins, receive his/her name from the server
socket.on('user-joined', data =>{
    append(`${name} joined the chat`, 'right')
})

// if server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// if user the leaves the chat, append the info to the container
socket.on('leave', name =>{
    append(`${name} left the chat`, 'right')
})

// if the form gets submitted send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`${name}: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})