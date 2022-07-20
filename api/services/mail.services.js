
const nodemailer = require("nodemailer");
const config = require("../../config/config");

const transporter = nodemailer.createTransport(config.smtpConfig);

exports.sendEmail = (to, subject, html) => {
    transporter.sendMail({
        from: config.sender,
        to,
        subject,
        html
    },(err, result) => {
        if (err){
            console.log("Email sent error",err.message)
           
        } else{
            console.log("Email sent",result)
        }
    })

}