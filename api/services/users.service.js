var User = require('../models/userModel')
var dbObj = require('../core/databaseFunction')
var config = require('../../config/config')
const email = require("./emailContant.service")
var logger = config.getLogger(__filename)

function getAllUsers(headers, cb) {
    if (headers.managerid && headers.organization && headers.managerid !== null) {
        var query = {
            manager_id: headers.managerid,
            organization: headers.organization
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
const addUser = (body, cb) => {
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
                cb(err)
            } else {
                email.welcomeMail(body.lastName, password, body.email)
                cb(null, resp)
            }
        })

    } catch (err) {
        logger.error("profileManage", err.message);
    }

}

module.exports = { getAllUsers, addUser }//   .getAllUsers = getAllUsers