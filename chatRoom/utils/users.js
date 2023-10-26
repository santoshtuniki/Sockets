const users = [];

// Join USER to chat
const joinUser = (id, userName, room) => {
    const user = { id, userName, room };
    users.push(user);

    return user;
}

// Get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

// User leaves the chat
const userLeavesChat = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room Users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeavesChat,
    getRoomUsers
};