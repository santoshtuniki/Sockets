const Room = require("../model/roomSchema");

const getUsers = async (roomId) => {
    let response;

    try{
        const users = await Room.findById(roomId).populate("joinedUsers", "userName _id").lean();  // Object
        // add a property isConnected
        users.joinedUsers = users.joinedUsers.map((user) => {
            return {...user, isConnected: false}
        });
        // console.log("users: ", users)
        
        if(users){
            response =  {
                users,
                status: true
            };
        }else{
            response = {
                message: "No Users available",
                status: false
            };
        }
    }catch(error){
        console.log("getUsers Error: ", error.message);
        response =  {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = getUsers;