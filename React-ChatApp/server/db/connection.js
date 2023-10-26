require("dotenv").config();

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        })
        console.log("Connected Successfully");
    }catch(err){
        console.log("db connection Error: ",err.message);
    }
}

module.exports = connectDB;