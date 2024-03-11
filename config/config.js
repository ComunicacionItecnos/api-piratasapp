const dotenv = require('dotenv');
dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  DB_URI: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  keyCrypto: process.env.KEY_CRYPTO,
  oneSignalAppId: process.env.ONESIGNAL_APP_ID,
  oneSignalUserKey: process.env.ONESIGNAL_USER_KEY,
  socketCLientUrl: process.env.SOCKET_CLIENT_URL,
};

module.exports = config;
