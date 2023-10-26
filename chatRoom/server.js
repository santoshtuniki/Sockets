// module imports
const express = require("express");
const WebSocket = require("socket.io");

// module in-built
const path = require("path");
const http = require("http");

// component imports
const formatMessage = require('./utils/messages');
const { joinUser, getCurrentUser, userLeavesChat, getRoomUsers } = require('./utils/users');

// Creates an Express application
const app = express();

// Returns a new instance of Server.
const server = http.createServer(app);

// Creating a Socket server
const io = WebSocket(server);

const PORT = process.env.PORT || 3000;
const botName = 'chatBot';

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on('connection', (socket) => {

    // Receive userName & room from USER
    socket.on('joinRoom', ({ userName, room }) => {

        const user = joinUser(socket.id, userName, room);
        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat'));

        // broadcast within the room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.userName} has joined the chat`));

        // Send users & room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // broadcast --> sends message to all clients except USER
        // socket.broadcast.emit('message', formatMessage(user,'A user has joined the chat'));     
    });

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.userName, msg));
    })

    // Runs when the client disconnects
    socket.on('disconnect', () => {
        const user = userLeavesChat(socket.id);

        if (user) {
            // to send message to all the clients
            io.to(user.room).emit('message', formatMessage(botName, `${user.userName} has left the chat`));

            // Send users & room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})