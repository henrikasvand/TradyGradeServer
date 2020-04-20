const io = require('socket.io')();
const { ChatUser } = require('../models/ChatUser')

let socketApi = {};

io.on('connection', socket => {
    console.log('Connected', socket.id)

    socket.on('joinChat', (username, chatID ) => {
        const user = ChatUser(socket.id, username, chatID)

        socket.join(user.chatID, () => {
            // socket.broadcast.to(chatID).emit('user online', `${user.username} is online`)
            console.log(`You have joined chat ${user.chatID}`)
        }) 

        //Welcome user to chat
        socket.emit('message', `Welcome to chat nro.${user.chatID} ${user.username}!`)

        //User typing a message...
        socket.on('typing', (username, cID) => { 
            socket.broadcast.to(cID).emit('typing', username) 
        })

        //Listening for chatMessage
        socket.on('chatMessage', message => {
            console.log(message)
            
            //Commit message to only this chatID
            io.to(user.chatID).emit('new message', message)
        })

        //User going offline
        socket.on('disconnect', () => {
            io.emit('user disconnect', `${user.username} is no longer online`)
            console.log("connection disconnected:", socket.id)
        })
    })

});

socketApi.io = io;

module.exports = socketApi; 