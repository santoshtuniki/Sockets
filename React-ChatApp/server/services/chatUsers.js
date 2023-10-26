const moment = require("moment");
const Chat = require("../model/chatSchema");

// const chatUsers = async (userName, userId, roomName, roomId, msg) => {
const chatUsers = async ({userName, userId, roomName, roomId}, msg) => {
    let response;

    try{
        const chat = new Chat({
            userName,
            userId,
            roomName,
            roomId,
            message: {
                text: msg,
                time: moment().format('hh:mm a'),
                date: moment().format('LL')
            }
        })
        await chat.save();
        response = {
            users : chat,    // Object
            status: true
        };
    }catch(error){
        console.log("chatUsers Error: ", error.message);
        response =  {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = chatUsers;