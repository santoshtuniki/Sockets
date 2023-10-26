const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    gender: {
        type: String
    },
    contact: {
        type: String
    },
    skills: {
        type: [String]
    }
});

const User = mongoose.model("User", userSchema);

module.exports=User;