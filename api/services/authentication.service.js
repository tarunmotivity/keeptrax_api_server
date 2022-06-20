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
module.exports.appTest = appTest;
module.exports.getOrganizations = getOrganizations;
module.exports.signup = signup;

