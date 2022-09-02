var Organizations = require("../models/organizationModel");
var Applications = require("../models/applicationModel");
var TeamsModel = require('../models/teamsModel')
var dbObj = require("../core/databaseFunction");
var UserService = require("../services/users.service");
var request = require("request");

function addOrganization(req, cb) {
    var role = req.user.role;
    if (role && role == "SuperAdmin") {
        var orgObj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            website: req.body.website,
            createdOn: new Date(),
            lastUpdatedOn: new Date(),
        };
        var model = new Organizations(orgObj);
        dbObj.save(model, function (err, response) {
            if (err) {
                cb({ status: 400, message: err.message });
            } else {
                var options = {
                    method: "POST",
                    url: `https://demo.keeptraxapp.com//api/v2.0.1/organizations/${response._id}/applications`,
                    body: {
                        name: req.body.appName,
                        Description: req.body.description,
                    },
                };
                request(options, function (appErr, appResp) {
                    if (appErr) {
                        cb({ status: 400, message: appErr });
                    } else {
                        var userObj = {
                            email: req.body.email,
                            password: req.body.password,
                            organization: response.organization,
                            application: appResp._id,
                        };
                        UserService.addUser(userObj, function (userErr, userResp) {
                            if (userErr) {
                                cb({ status: 400, message: userErr });
                            } else {
                                cb(null, userResp);
                            }
                        });
                    }
                });
                // cb(null, { status: 200, data: response })
            }
        });
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}

function getOrganization(req, cb) {
    var role = req.user.role;
    if (role && role == "SUPERADMIN") {
        Organizations.aggregate(
            [
                {
                    $lookup: {
                        from: "applications",
                        localField: "_id",
                        foreignField: "organization",
                        as: "applications",
                    },
                },
            ],
            function (err, response) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, { status: 200, data: response, message: "" });
                }
            }
        );
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}

function addAdmin(req, cb) {
    var role = req.user.role;
    if (role && role == "SUPERADMIN") {
        const userPayload = {
            ...req.body,
            tripId: 1,
            manager_id: req.user._id,
            lockUntil: 0,
            oauth_id: null,
        };
        UserService.addUser(userPayload, (err, resp) => {
            if (err) {
                cb({ status: 400, message: err });
            } else {
                cb(null, { status: 200, data: resp, message: "User added susccessfully" });
            }
        });
    } else if (role && role == "ADMIN") {
        const userPayload = {
            ...req.body,
            tripId: 1,
            manager_id: req.user._id,
            organization: req.user.organization,
            application: req.user.application,
            lockUntil: 0,
            oauth_id: null,
        };
        UserService.addUser(userPayload, (err, resp) => {
            if (err) {
                cb({ status: 400, message: err });
            } else {
                cb(null, { status: 200, data: resp, message: "User added susccessfully" });
            }
        });
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}

function addTeamMember(req, cb) {
    var role = req.user.role;
    if (role && role == "ADMIN"||role && role == "SUPERADMIN") {
        var updateObj = {
            teamId: req.body.teamId,
            email: req.body.email
        }
        UserService.updateUser(req, updateObj, (err, resp) => {
            if (err) {
                cb({ status: 400, message: err });
            } else {
                cb(null, resp);
            }
        });
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}


function addTeams(req, cb) {
    var teamsObj = {
        name: req.body.name,
        organization: req.body.organization,
        application: req.body.application,
        adminId: req.body.adminId,
        createdOn: new Date(),
        lastUpdatedOn: new Date()
    }
    var model = new TeamsModel(teamsObj)
    dbObj.save(model, function (err, response) {
        if (err) {
            cb({ status: 400, message: err.message })
        } else {
            cb(null, response)
        }
    })

}

module.exports.addAdmin = addAdmin;
module.exports.addOrganization = addOrganization;
module.exports.getOrganization = getOrganization;
module.exports.addTeams = addTeams;
module.exports.addTeamMember = addTeamMember;

