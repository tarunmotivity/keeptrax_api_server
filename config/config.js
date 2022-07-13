var logger4js = require('log4js');

module.exports.port = 3010 || process.env.applicationPort
module.exports.environment = "dev" || process.env.environment
module.exports.dbUri = "mongodb://52.34.148.49:27017/qa?retryWrites=true&w=majority"
// module.exports.dbUri = "mongodb://localhost:27017/qa?retryWrites=true&w=majority"


module.exports.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    auth: {
        username: 'myUserAdmin', password: 'KeepTrax123'
    }
}
module.exports.smtpConfig = {
    host: 'email-smtp.us-west-2.amazonaws.com',
    port: 587,
    auth: {
        user: 'AKIA6H4KE3HURCERT2XP',
        pass: 'BGfJoJzQe4UQunVSutsntrpwmW/CyWXXXiWx4gCuNwkm'
    }
}

module.exports.sender='userverify-noreply@keeptraxapp.com',


logger4js.configure({
    appenders: {
        app: {
            type: "file",
            filename: "./logs/app.log"
        },
        out: {
            "type": "stdout"
        },
    },
    categories: {
        default: {
            appenders: ["app", "out"],
            level: "error"
        }
    }
})

module.exports.getLogger = (name) => {
    let data = logger4js.getLogger(name || 'logs')
    data.level = 'debug'
    return data
}