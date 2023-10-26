const moment = require('moment');

const message = ({userName, userId, roomName, roomId}, msg) => {
    return {
        users: {
            userName,
            userId,
            roomName,
            roomId,
            message: {
                text: msg,
                time: moment().format('hh:mm a'),
                date: moment().format('LL')
            }
        },
        status: true
    }
};

module.exports = message;