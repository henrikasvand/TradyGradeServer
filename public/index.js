// Create connection to socket
const socket = io.connect("http://localhost:9000");

const message = document.getElementById('message');
const user = document.getElementById('user');
const send = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

send.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        user: user.value
    });
});

message.addEventListener('keypress', () => {
    socket.emit('typing', user.value);
})

socket.on('chat', (data) => {
    feedback.innerHTML = ``
    output.innerHTML += `<p><b>${data.user}: </b>${data.message}</p>`
})

socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`

})