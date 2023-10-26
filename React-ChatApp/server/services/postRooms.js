const Room = require("../model/roomSchema");

const postRooms = async (roomName) => {
    let response;
    
    try{
        const room = new Room({
            roomName: roomName
        })
        await room.save(); 
        response =  {
            message: `${roomName} added successfully to db`,
            rooms: room,    // Object
            status: true
        };
    }catch(error){
        console.log("postRooms Error: ", error.message);
        response =  {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = postRooms;