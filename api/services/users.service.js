var User = require('../models/userModel')
var dbObj = require('../core/databaseFunction')
var config = require('../../config/config')
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
        cb({ code: 404, error:"managerid and organizationid are required" })
    }

}

module.exports.getAllUsers = getAllUsers