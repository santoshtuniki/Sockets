const User = require("../model/userSchema");

const forgotPassword = async ({emailId}) => {
    let response;
    try{
        const user = await User.find({emailId});
        if(user?.length===0){
            response = {
                message: "Email ID not registered",
                status: false
            };
        }else{
            response = {
                message: "Verification success",
                status: true
            };
        }
    }catch(error){
        console.log("forgotPassword Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = forgotPassword;