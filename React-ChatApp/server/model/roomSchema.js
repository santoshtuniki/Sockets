const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    joinedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;