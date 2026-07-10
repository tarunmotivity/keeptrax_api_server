const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/userModel");
const UserSession = require("../models/usersessions");
const Application = require("../models/applicationModel");
var Organizations = require('../models/organizationModel')
var Applications = require('../models/applicationModel')
var dbObj = require('../core/databaseFunction')


function appTest(cb) {
    cb(null, 'Welcome to Keeptrax Api')
}

function getOrganizations(cb) {
    dbObj.getAll(Organizations, {}, (err, resp) => {
        if (err) {
            cb(err)
        } else {
            cb(null, resp)
        }
    })

}
function signup(headers, body, cb) {
    var dbQuery = {
        organization: body.orgid
    }
    dbObj.getAll(Applications, dbQuery, function (error, response) {
        if (error) {
            cb(error)
        } else {
            cb(null, response)
        }
    })
}

function login(headers, cb) {

    try {

        const basic = headers.basic;

        if (!basic) {
            return cb({ status: 401, message: "Missing Authorization Header" });
        }

        const decoded = Buffer.from(basic, "base64").toString("ascii");
        const [email, password] = decoded.split(":");

       User.findOne({ email: email, activeStatus: true })
    .populate("application")
    .exec(async (err, user) => {

        if (err) return cb(err);

        if (!user) {
            return cb({
                code: "InvalidCredentials",
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return cb({
                code: "InvalidCredentials",
                message: "Invalid email or password"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const session = new UserSession({
            user: user._id,
            application: user.application._id,
            organization: user.organization,
            token: token,
            activeStatus: true,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        });

        await session.save();

        return cb(null, {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token: {
                token: token
            },
            apiKey: user.application.apiKey,
            secretKey: user.application.secretKey
        });

    });
    } catch (err) {
        cb(err);
    }

}
module.exports.appTest = appTest;
module.exports.getOrganizations = getOrganizations;
module.exports.signup = signup;
module.exports.login = login;

