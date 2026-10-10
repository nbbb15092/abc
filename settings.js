const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {

SESSION_ID: process.env.SESSION_ID === undefined ? '' : process.env.SESSION_ID,
PORT: process.env.PORT === undefined ? "8000" : process.env.PORT,
SESSION_NAME: process.env.SESSION_NAME === undefined ? "asitha" : process.env.SESSION_NAME,
OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? "94789121558" : process.env.OWNER_NUMBER,
BOT_NAME: process.env.BOT_NAME === undefined ? "sasiya-md" : process.env.BOT_NAME,
OWNER_NAME: process.env.OWNER_NAME === undefined ? "Sasiya" : process.env.OWNER_NAME,
WORK_TYPE: process.env.WORK_TYPE === undefined ? "public" : process.env.WORK_TYPE,
TIME_ZONE: process.env.TIME_ZONE === undefined ? "Asia/Colombo" : process.env.TIME_ZONE,
};
