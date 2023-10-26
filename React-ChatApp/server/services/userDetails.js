const registerUser = require("../controllers/register");
const loginUser = require("../controllers/login");
const forgotPassword = require("../controllers/forgotPassword");
const changePassword = require("../controllers/changePassword");
const changeUserName = require("../controllers/changeUserName");
const { getProfile, updateProfile } = require("../controllers/updateProfile");

const userDetails = (socket) => {

    // Receive userRegister details 
    socket.on("register", async (body) => {
        socket.emit("onRegister", await registerUser(body))
    });

    // Receive loginRegister details 
    socket.on("login", async (body) => {
        socket.emit("onLogin", await loginUser(body))
    });

    // Receive forgotPassword details 
    socket.on("forgotPassword", async (body) => {
        socket.emit("onForgot", await forgotPassword(body))
    });

    // Receive changePassword details 
    socket.on("changePassword", async (body) => {
        socket.emit("updatePassword", await changePassword(body))
    });

    // Receive changeUserName details 
    socket.on("changeUserName", async (body) => {
        socket.emit("updateUserName", await changeUserName(body))
    });

    // Receive getProfile details 
    socket.on("getProfile", async (body) => {
        socket.emit("getProfile", await getProfile(body))
    });

    // Receive updateProfile details 
    socket.on("updateProfile", async (body) => {
        socket.emit("onUpdate", await updateProfile(body))
    });

};

module.exports = userDetails;