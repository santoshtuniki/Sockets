const User = require("../model/userSchema");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req,res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req,res,cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storage });

const getProfile =  async(id) => {
    let response;
    try{
        const user = await User.findById(id);
        response  = {
            message: user,
            status: false
        };
        
    }catch(error){
        console.log("getProfile Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

const updateProfile =  async({firstName, lastName, gender, contact, skills, profile}) => {
    let response;
    try{
        
        const user = await User.findByIdAndUpdate(req.params.id, {$set: updates}, {new:true});
        // when id is not found in db
        if(user.length===0){
            response = {
                message: "User not found",
                status: false
            };
        }else{
            response  = {
                message: user,
                status: false
            };
        }
        
    }catch(error){
        console.log("getProfile Error: ", error.message);
        response = {
            message: error.message,
            status: false
        };
    }

    return response;
};

module.exports = {
    getProfile, updateProfile
};