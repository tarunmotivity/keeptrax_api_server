var Visits = require('../models/visitsModel');
var UserPlaces = require('../models/userPlacesModel');
var dbObj = require('../core/databaseFunction');

function getAllTrax(headers, cb) {
    var traxData = {}
    if (headers.startdate && headers.enddate && headers.userid) {
        var dbQuery = {
            account: headers.userid,
            createdOn: { $gte: new Date(headers.startdate), $lte: new Date(headers.enddate) }
        }
        console.log("USER ID:", headers.userid);
console.log("START:", headers.startdate);
console.log("END:", headers.enddate);
console.log("QUERY:", dbQuery);
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
async function getUserTrax(req, cb) {

    try {

        const query = {
            account: req.params.id
        };

        if (req.query.start && req.query.end) {
            query.entryTime = {
                $gte: new Date(Number(req.query.start)),
                $lte: new Date(Number(req.query.end))
            };
        }

        const rows = Number(req.query.rows) || 25;

        const visits = await Visits.find(query)
            .populate("userPlace")
            .sort({ entryTime: -1 })
            .limit(rows);

        cb(null, {
            visits: visits,
            visitsCount: visits.length
        });

    } catch (err) {

        cb({
            status: 400,
            message: err.message
        });

    }

}
async function searchUserTrax(req, cb) {

    try {

        const q = req.query.q || "";

        // Extract timestamps from:
        // entryTime:[1645099200000 TO 1645185600000]
        const match = q.match(/entryTime:\[(\d+)\s+TO\s+(\d+)\]/);

        let query = {
            account: req.params.id
        };

        if (match) {

            query.entryTime = {
                $gte: new Date(Number(match[1])),
                $lte: new Date(Number(match[2]))
            };

        }

        const rows = Number(req.query.rows) || 25;

        const visits = await Visits.find(query)
            .populate("userPlace")
            .sort({ entryTime: -1 })
            .limit(rows);

        cb(null, {
            visits: visits,
            visitsCount: visits.length
        });

    } catch (err) {

        cb({
            status: 400,
            message: err.message
        });

    }

}

module.exports.searchUserTrax = searchUserTrax;
module.exports.getUserTrax = getUserTrax;
module.exports.getAllTrax = getAllTrax;