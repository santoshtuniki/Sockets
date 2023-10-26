const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

const User = require("../model/userSchema");

const loginUser =  async({emailId, password}) => {
    let response;
    try{
        const user = await User.findOne({emailId});

        // when email is not found in db
        if(user?.length === 0){
            response = {
                message: "User not found",
                status: false
            };
        }

        // compared given password with password from database
        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            // if password doesn't match
            response = {
                message: "Enter correct password",
                status: false
            };
        }else{
            // if password matches, create token
            const token = jwt.sign({ id: user._id, emailId }, secret, {expiresIn: '1800s'});
            response = {
                message: "User login successfully",
                user: user,
                status: true,
                token: token
            };
        }
        
    }catch(error){
        console.log("loginUser Error: ", error);
        response = {
            message: error.message,
            status: false
        };
    }
    
    return response;
}

module.exports = loginUser;