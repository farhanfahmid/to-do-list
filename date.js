
module.exports = getDate
const moment = require('moment-timezone');

function getDate() {

    // Set the timezone
    const timezone = 'Asia/Dhaka';
    const today = moment().tz(timezone).format('dddd');
    // var today = new Date();

    var options = {
        weekday: "long",
        // day: "numeric",
        // month: "long",
        // year: "numeric"
    }

    return today

}