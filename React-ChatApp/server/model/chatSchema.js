const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    roomName: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    message: {
        text: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;