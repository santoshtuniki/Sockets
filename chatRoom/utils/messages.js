const moment = require("moment");

const formatMessage = (userName, text) => {
    return {
        userName,
        text,
        time: moment().format('hh:mm a')
    }
}

module.exports = formatMessage;