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
const moment = require('moment');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

function getAllUsers(req, cb) {
    var query = {
        manager_id: req.user._id
    }
    // if (headers.managerid && headers.organization && headers.managerid !== null) {
    //     var query = {
    //         manager_id: headers.managerid,
    //         organization: headers.organization
    //     }
    //     if (headers.status && headers.status != null) {
    //         query.user_status = headers.status
    //     }
    //     if (headers.search && headers.search != null) {
    //         query.$or = [{
    //             firstname: {
    //                 "$regex": headers.search,
    //                 "$options": 'i'
    //             }
    //         }, {
    //             lastname: {
    //                 "$regex": headers.search,
    //                 "$options": 'i'
    //             }
    //         }]
    //     }
    dbObj.getAll(User, query, (err, resp) => {
        if (err) {
            logger.error("Error while getting all the users", err);
            cb({ status: 400, message: err.message })
            // cb(err)
        } else {
            cb(null, { status: 200, data: resp, message: "List" })
            // cb(null, resp)
        }
    })
    // } else {
    //     cb({ code: 404, error: "managerid and organizationid are required" })
    // }

}

function updateUser(req, userObj, cb) {
    if (!userObj.email) {
        return cb({ status: 400, message: "Email is required" })

    }
    dbObj.getById(User, { email: userObj.email }, function (error, userResp) {
        if (error) {
            cb({ status: 400, message: "You are not eligible to update this user", error: error.message })
            // cb(error)
        } else {
            if (!userResp) {
                return cb({ status: 400, message: "Manager not matched" });
            }
            if (req.user._id == userResp.manager_id) {
                var updateObj = {
                    lastUpdatedOn: new Date(),
                };
                if (userObj.activeStatus === false || userObj.activeStatus === true) {
                    updateObj["activeStatus"] = userObj.activeStatus;
                }
                if (userObj.title) {
                    updateObj["title"] = userObj.title;
                }
                if (userObj.mobile) {
                    updateObj["mobile"] = userObj.mobile;
                }

                if (userObj.firstname) {
                    updateObj["lastname"] = userObj.firstname;
                }
                if (userObj.lastname) {
                    updateObj["lastname"] = userObj.lastname;
                }
                if (userObj.gender) {
                    updateObj["gender"] = userObj.gender;
                }
                if (userObj.birthDate) {
                    updateObj["birthDate"] = moment(userObj.birthDate).format('YYYY-MM-DD');
                }
                if (userObj.role) {
                    updateObj["role"] = userObj.role;
                }
                dbObj.update(User, updateObj, { email: userObj.email }, function (err, response) {
                    if (err) {
                        cb({ status: 400, message: err.message })
                        // cb(err)
                    } else {
                        cb(null, { status: 200, message: "User updated susccessfully" })
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
            birthDate: moment(body.birthDate).format('YYYY-MM-DD'),
            email: body.email,
            mobile: body.mobile,
            title: body.title,
            tripId: body.tripId,
            password: password,
            firstname: body.firstname,
            lastname: body.lastname,
            organization: body.organization,
            application: body.application,
            lastUpdatedOn: new Date(),
            gender: body.gender,
            lockUntil: 0,
            role: body.role ? body.role : "USER",
            oauth_id: body.oauth_id,
            manager_id: body.manager_id
        };
        var model = new User(userPayload)
        dbObj.save(model, (err, resp) => {
            if (err) {
                logger.error("Error while addUser", err);
                cb({ status: 400, message: err.message })
            } else {
                email.welcomeMail(body.lastname, password, body.email)
                cb(null, { status: 200, data: resp, message: "User added susccessfully" })
            }
        })

    } catch (err) {
        cb({ status: 400, message: err.message })
        logger.error("profileManage", err.message);
    }

}

function updatePassword(req, cb) {
    try {
        bcrypt.compare(req.body.currentPassword, req.user.password, function (err, result) {
            if (result) {
                bcrypt.hash(req.body.newPassword, 10, async function (err, hash) {
                    if (err) {
                        cb({ status: 400, message: err.message })
                    } else {
                        var updateObj = {
                            password: hash
                        }
                        dbObj.update(User, updateObj, { email: req.user.email }, function (err, response) {
                            if (err) {
                                cb({ status: 400, message: err.message })
                                // cb(err)
                            } else {
                                cb({ status: 200, data: response, message: "password updated susccessfully" })
                                // cb(null, response)
                            }
                        })

                    }
                })

            } else {
                cb({ status: 400, message: "Current password doesn't match" })
            }
            // result == true
        });
        // console.log(req.body)
        // console.log(req.user)


    } catch (err) {
        cb({ status: 400, message: err.message })
        logger.error("profileManage", err.message);
    }


}


function getUserById(req,userObj, cb) {
    dbObj.getById(User, { _id: userObj.id }, function (error, userResp) {
        if (error) {
            cb({ status: 400, message: "You are not eligible to update this user", error: error.message })
            // cb(error)
        } else {
            if (!userResp) {
                return cb({ status: 400, message: "Manager not matched" });
            }
            // if (req.user._id != userResp.manager_id) {
            //     return cb({ status: 400, message: "your manager ID is not allowed " })
            // }
            cb(null, { status: 200, data: userResp })
        }
    });
}

module.exports.getAllUsers = getAllUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.addUser = addUser;
module.exports.updatePassword = updatePassword;
module.exports.getUserById = getUserById;

