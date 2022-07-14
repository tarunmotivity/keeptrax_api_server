var Visits = require('../models/visitsModel');
var UserPlaces = require('../models/userPlacesModel');
var dbObj = require('../core/databaseFunction');

function getAllTrax(headers, cb) {
    console.log("headers--->", headers)
    var traxData = {}
    if (headers.startdate && headers.enddate && headers.userid) {
        var dbQuery = {
            account: headers.userid,
            createdOn: { $gte: new Date(headers.startdate), $lte: new Date(headers.enddate) }
        }
        dbObj.getAndPopulate(Visits, dbQuery, 'userPlace', function (err, response) {
            if (err) {
                cb(err)
            }
            else {
                traxData.visits = response
                traxData.visitsCount = response.length
                placesCount(headers.startdate, headers.enddate, headers.userid, function (error, count) {
                    if (error) {
                        cb(error)
                    } else {
                        traxData.placesCount = count;
                        cb(null, traxData)
                    }
                })
            }
        })
    } else {
        cb({ status: 400, message: "Start date , end date and user Id are required" })
    }

}

function placesCount(startDate, endDate, userId, cb) {
    if (startDate && endDate && userId) {
        var dbQuery = {
            account: userId,
            createdOn: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
        dbObj.getCount(UserPlaces, dbQuery, function (err, response) {
            if (err) {
                cb(err)
            }
            else {
                cb(null, response)
            }
        })
    } else {
        cb({ status: 400, message: "Start date , end date and user Id are required" })
    }
}
module.exports.getAllTrax = getAllTrax;