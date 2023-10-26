const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../model/userSchema");

const registerUser = async ({firstName, lastName, emailId, userName, password, confirmPassword}) => {
    let response;
    try{
        const user = await User.find({emailId});

        // when email is already found in db
        if(user?.length>0){
            response = {
                message: "User already registered",
                status:false
            };
        }
        else{
            // when password & confirmPassword are not matching
            if(password!==confirmPassword){
                response = {
                    message: "Enter correct password",
                    status:false
                };
            }else{
                // when password is matched & new user is to be added to database
                const hashPassword = await bcrypt.hash(password, saltRounds);

                const user = new User({
                    firstName,
                    lastName,
                    emailId,
                    userName,
                    password: hashPassword
                });
                user.save();

                response = {
                    message: "User registered successfully",
                    status:true
                };
            }
        }
    }catch(error){
        console.log("registerUser Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = registerUser;