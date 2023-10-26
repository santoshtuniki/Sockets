const User = require("../model/userSchema");

const changeUserName = async ({emailId, userName}) => {
    let response;
    try{
        await User.findOneAndUpdate({emailId}, {userName}, {new: true});
        response = {
            message: "Updated userName successfully",
            status: true
        };
    }catch(error){
        console.log("changeUserName Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = changeUserName;