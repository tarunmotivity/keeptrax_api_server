var nodemailer = require('nodemailer');
var ejs = require('ejs');
var path = require('path');
var _ = require('lodash');
var User = require('../models/userModel');
var Visits = require('../models/visitsModel');
var UserPlaces = require('../models/userPlacesModel');
var dbObj = require('../core/databaseFunction');
var config = require('../../config/config');
var TraxService = require("./trax.service");
const email = require("./emailContant.service")
var logger = config.getLogger(__filename);
var CWD = process.cwd();

function getAllUsers(headers, cb) {
    if (headers.managerid && headers.organization && headers.managerid !== null) {
        var query = {
            manager_id: headers.managerid,
            organization: headers.organization
        }
        if (headers.status && headers.status != null) {
            query.status = headers.status
        }
        if (headers.search && headers.search != null) {
            query.$or = [{
                firstname: {
                    "$regex": headers.search,
                    "$options": 'i'
                }
            }, {
                lastname: {
                    "$regex": headers.search,
                    "$options": 'i'
                }
            }]
        }
        dbObj.getAll(User, query, (err, resp) => {
            if (err) {
                logger.error("Error while getting all the users", err);
                cb(err)
            } else {
                cb(null, resp)
            }
        })
    } else {
        cb({ code: 404, error: "managerid and organizationid are required" })
    }

}

function updateUser(headers, userObj, cb) {
    dbObj.getById(User, { email: headers.email }, function (error, userResp) {
        if (error) {
            cb(error)
        } else {
            if (headers.managerid == userResp.manager_id) {
                var updateObj = {
                    firstname: userObj.firstName,
                    lastname: userObj.lastName,
                    lastUpdatedOn: new Date(),
                    gender: userObj.gender,
                    birthDate: userObj.birthDate,
                }
                dbObj.update(User, updateObj, { email: headers.email }, function (err, response) {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, response)
                    }
                })
            } else {
                cb({ status: 400, message: "You are not eligible to update this user" })
            }
        }
    })


}

function deleteUser(headers, cb) {
    dbObj.getById(User, { email: headers.email }, function (error, userResp) {
        if (error) {
            cb(error)
        } else {
            if (headers.managerid == userResp.manager_id) {
                var updateObj = {
                    manager_id: null
                }
                dbObj.update(User, updateObj, { email: headers.email }, function (err, response) {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, { status: 200, message: "User deleted susccessfully" })
                    }
                })
            } else {
                cb({ status: 400, message: "You are not eligible to delete this user" })
            }
        }
    })


}

function addUser(body, cb) {
    try {

        const password = Math.random().toString(36).slice(-10);
        var userPayload = {
            birthDate: body.birthDate,
            email: body.email,
            mobile: body.mobile,
            title: body.title,
            tripId: body.tripId,
            password: password,
            firstname: body.firstName,
            lastname: body.lastName,
            organization: body.organization,
            application: body.application,
            lastUpdatedOn: new Date(),
            gender: body.gender,
            lockUntil: 0,
            role: body.role ? body.role : "USER",
            oauth_id: body.oauth_id
        }
        var model = new User(userPayload)
        dbObj.save(model, (err, resp) => {
            if (err) {
                logger.error("Error while addUser", err);
                cb({ status: 400, message: err.message })
            } else {
                email.welcomeMail(body.lastName, password, body.email)
                cb(null, {status:200,data:resp ,message :"User added susccessfully"})
            }
        })

    } catch (err) {
        logger.error("profileManage", err.message);
    }

}

module.exports.getAllUsers = getAllUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.addUser = addUser;

