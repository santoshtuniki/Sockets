const moment = require("moment");
const Room = require("../model/roomSchema");

const joinUsers = async (userId, roomId) => {
    let response;

    try{
        const room = await Room.findById(roomId);   // Object
        const isTrue = room.joinedUsers.includes(userId);
        if(!isTrue){
            const result = await Room.findByIdAndUpdate(roomId, { "$push": { "joinedUsers": userId} }, {new: true});    // Object
            // console.log("Joined result: ", result);
            response = {
                message: `User joined the room`,
                status: true
            };
        }else{
            response = {
                message: "User already joined the room",
                status: false
            };
        }
    }catch(error){
        console.log("joinUsers Error: ", error.message);
        response =  {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = joinUsers;