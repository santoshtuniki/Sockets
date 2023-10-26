const Chat = require("../model/chatSchema");

const prevMessages = async (users, roomId) => {
    let response;

    try{
        const previous = await Chat.find({roomId: roomId});  // Object
        // console.log("Previous: ", previous);
        if(previous.length>0){
            response =  {
                previous,
                status: true
            };
        }else{
            response = {
                message: "No messages",
                status: false
            };
        }
    }catch(error){
        console.log("prevMessages Error: ", error.message);
        response =  {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = prevMessages;