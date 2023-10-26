const User = require("../model/userSchema");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const changePassword = async ({emailId, password, confirmPassword}) => {
    let response;
    if(password === confirmPassword){
        const hashPassword = await bcrypt.hash(password, saltRounds);
        try{
            await User.findOneAndUpdate({emailId}, {password: hashPassword}, {new: true});
            response = {
                message: "Updated password successfully",
                status: true
            };
        }catch(error){
            console.log("changePassword Error: ", error.message);
            response = {
                message: error.message,
                status: false
            };
        }
    }else{
        response = {
            message: "Enter correct password",
            status: false
        };
    }

    return response;
};

module.exports = changePassword;