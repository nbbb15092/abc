const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {

SESSION_ID: process.env.SESSION_ID === undefined ? 'VAJIRA-MD=a0AnhAyR#wqF-UgIbFAMW3nLx9ZwYz5CHMjntS3FVTc2_cEHA38U' : process.env.SESSION_ID,
PORT: process.env.PORT === undefined ? "8000" : process.env.PORT,
SESSION_NAME: process.env.PORT === undefined ? "asitha" : process.env.SESSION_NAME,
POSTGRESQL_URL: process.env.POSTGRESQL_URL === undefined ? 'postgresql://postgres:@Asitha2005b@db.waiqbrnuxkjebghzhovz.supabase.co:5432/postgres' : process.env.POSTGRESQL_URL,
};
