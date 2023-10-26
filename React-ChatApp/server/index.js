require("dotenv").config();
const cors = require("cors");
const http = require("http");
const express = require("express");
const { Server } =  require("socket.io");

const connectDB = require("./db/connection");
const connectUsers = require("./services/connectUsers");
const userDetails = require("./services/userDetails");

connectDB();

const PORT = 5700 || process.env.PORT;

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors({
    origin: "http://localhost:3000"
}));

io.on("connection", (socket) => {   
    console.log("A user is connected");

    // userDetails
    userDetails(socket);

    // connect to Users
    connectUsers(socket, io);
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});