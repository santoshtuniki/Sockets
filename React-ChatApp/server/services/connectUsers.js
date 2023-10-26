const chatUsers = require("./chatUsers");
const getRooms = require("./getRooms");
const getUsers = require("./getUsers");
const joinUsers = require("./joinUsers");
const postRooms = require("./postRooms");
const prevMessages = require("./prevMessages");
const message = require("./message");

const connectUsers = async (socket, io) => {

    // let user_name, user_id, room_name, room_id;

    // Send RoomsList to the clients
    io.emit("allRooms", await getRooms());

    // Receive newRoom from client
    socket.on("newRoom", async (roomName) => { //roomname
        const response = await postRooms(roomName);
        socket.emit("addNewRoom", response);
    });

    // Recieve userDetails from client
    socket.on("joinUsers", async ({userName, userId, roomName, roomId}) => {

        // store Ids, Names in data attribute
        socket.data.userId = userId;
        socket.data.roomId = roomId;
        socket.data.userName = userName;
        socket.data.roomName = roomName;
        // console.log("socket.data: ", socket.data);

        // Join Client to ROOM
        socket.join(socket.data.roomName);

        // Response to join the room
        socket.emit("onJoining", await joinUsers(socket.data.userId, socket.data.roomId));

        // Send users & room info
        const response = await getUsers(socket.data.roomId);
        const filteredResponse = response.users.joinedUsers.map((user) => {
            if (user._id.toString() === socket.data.userId) {
                return { ...user, isConnected: true };
            } else {
                return user;
            }
        });
        const users = response.status ? filteredResponse : [];
        io.to(socket.data.roomName).emit("roomUsers", {users});

        // Send previous messages
        // console.log("Users: ", users);
        if(users.length>1){
            io.to(socket.data.roomName).emit("prev_messages", await prevMessages(users, socket.data.roomId));
        }

        // broadcast within the room
        socket.to(socket.data.roomName)
            .emit('joinMessage', message(socket.data, `${socket.data.userName} has joined the chat`));
    })

    // Listen for chat message
    socket.on('message', async (msg) => {
        io.to(socket.data.roomName)
        .emit('response', await chatUsers(socket.data, msg));
    });

    // Runs when the client is disconnecting
    socket.on('disconnecting', async () => {
        // console.log('disconnecting: ', socket.data);

        if(Object.keys(socket.data).length>0){
            socket.to(socket.data.roomName)
                .emit('message',  message(socket.data, `${socket.data.userName} has left the chat`) );
                

            // Send users & room info
            const response = await getUsers(socket.data.roomId);
            const filteredResponse = response.users.joinedUsers.map((user) => {
                if (user._id.toString() === socket.data.userId) {
                    return { ...user, isConnected: "falsy" };
                } else {
                    return user;
                }
            });
            const users = response.status ? filteredResponse : [];
            io.to(socket.data.roomName).emit("roomUsers", {users});
        }
    });

    // Runs when the client disconnects
    socket.on("disconnect", (reason) => {
        console.log("Disconnect Reason: ", reason);
    });

};

module.exports = connectUsers;