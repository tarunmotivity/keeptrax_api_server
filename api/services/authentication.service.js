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
async function signup(headers, body, cb) {
    try {

        const {
            email,
            password,
            firstname,
            lastname,
            mobile,
            applicationId
        } = body;

        if (!email || !password || !mobile || !applicationId) {
            return cb({
                status: 400,
                message: "email, password, mobile and applicationId are required"
            });
        }

        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return cb({
                status: 409,
                message: "Email already exists"
            });
        }

        const application = await Applications.findById(applicationId);

        if (!application) {
            return cb({
                status: 404,
                message: "Application not found"
            });
        }

        const user = new User({
            email,
            password,
            firstname,
            lastname,
            mobile,
            organization: application.organization,
            application: application._id,
            activeStatus: true,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        });

        await user.save();

        const token = crypto.randomBytes(32).toString("hex");

        const session = new UserSession({
            user: user._id,
            application: application._id,
            organization: application.organization,
            token,
            activeStatus: true,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        });

        await session.save();

        return cb(null, {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            createdon: user.createdOn,
            lastupdatedOn: user.lastUpdatedOn,
            apiKey: application.apiKey,
            secretKey: application.secretKey,
            token: {
                token: token
            }
        });

    } catch (err) {
        cb({
            status: 500,
            message: err.message
        });
    }
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

