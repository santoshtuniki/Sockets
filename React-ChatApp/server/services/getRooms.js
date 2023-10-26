const Room = require("../model/roomSchema");

const getRooms = async () => {
    let response;

    try{
        const rooms = await Room.find({});
        // console.log(rooms)
        if(rooms.length>0){
            response = {
                rooms: rooms,
                status: true
            };
        }else{
            response = {
                message: "No Rooms avaiable",
                status: false
            };
        }
    }catch(error){
        console.log("getRooms Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = getRooms;