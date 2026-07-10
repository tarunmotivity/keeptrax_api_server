var logger4js = require('log4js');

module.exports.port = process.env.PORT || 3010;
module.exports.environment = process.env.ENVIRONMENT || "dev";

module.exports.dbUri = process.env.MONGO_URI;

module.exports.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    auth: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
};

module.exports.smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

module.exports.sender = process.env.SENDER_EMAIL;