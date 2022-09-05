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
    if (role && role == "ADMIN" || role && role == "SUPERADMIN") {
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
        organization: req.user.organization,
        application: req.user.application,
        adminId: req.user._id.toString(),
        description: req.body.description,
        createdOn: new Date(),
        lastUpdatedOn: new Date()
    }
    var model = new TeamsModel(teamsObj)
    dbObj.save(model, function (err, response) {
        if (err) {
            cb({ status: 400, message: err.message })
        } else {
            cb(null, {
                status: 200,
                message: "Team created successfully",
            })
        }
    })

}

async function getTeams(req, cb) {
    try {
        const resp = await TeamsModel.aggregate([
            {
                $match: {
                    organization: req.user.organization,
                    application: req.user.application
                }
            },
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    "name": "$name",
                    "description": "$description",
                    "organization": "$organization",
                    "application": "$application",
                    "adminId": "$adminId",
                    "createdOn": "$createdOn",
                    "lastUpdatedOn": "$lastUpdatedOn"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "team_id",
                    as: "users",
                },
            },
        ]);
        cb(null, { status: 200, data: resp, message: "List" })

    }
    catch (err) {
        cb({ status: 400, message: err.message })
    }
    //  dbObj.getAll(TeamsModel, {
    //     organization: req.user.organization,
    //     application: req.user.application
    //  }, (err, resp) => {
    //     if (err) {
    //         logger.error("Error while getting all the users", err);
    //         cb({ status: 400, message: err.message })
    //     } else {
    //         cb(null, { status: 200, data: resp, message: "List" })
    //     }
    // })

}

function updateOrganization(req, cb) {
    var role = req.user.role;
    if (role && role == "SUPERADMIN") {
        dbObj.getById(Organizations, { _id: req.query.orgid }, function (error, orgResp) {
            if (error) {
                cb({
                    status: 400,
                    message: "Oragnization not found",
                    error: error.message,
                });
            } else {
                if (!orgResp) {
                    return cb({ status: 400, message: "Oragnization not matched" });
                }
                var updateObj = {
                    lastUpdatedOn: new Date(),
                };
                if (req.body.name) {
                    updateObj.name = req.body.name
                }
                if (req.body.website) {
                    updateObj.website = req.body.website
                }

                dbObj.update(
                    Organizations,
                    updateObj,
                    { _id: req.query.orgid },
                    function (err, response) {
                        if (err) {
                            cb({ status: 400, message: err.message });
                            // cb(err)
                        } else {
                            cb(null, { status: 200, message: "Organization updated susccessfully" });
                        }
                    }
                );

            }
        });
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}

function updateApplication(req, cb) {
    var role = req.user.role;
    if (role && role == "SUPERADMIN") {
        dbObj.getById(Applications, { _id: req.query.appid }, function (error, appResp) {
            if (error) {
                cb({
                    status: 400,
                    message: "Application not found",
                    error: error.message,
                });
            } else {
                if (!appResp) {
                    return cb({ status: 400, message: "Application not matched" });
                }
                var updateObj = {
                    lastUpdatedOn: new Date(),
                };
                if (req.body.name) {
                    updateObj.name = req.body.name
                }
                if (req.body.description) {
                    updateObj.description = req.body.description
                }

                dbObj.update(
                    Applications,
                    updateObj,
                    { _id: req.query.appid },
                    function (err, response) {
                        if (err) {
                            cb({ status: 400, message: err.message });
                            // cb(err)
                        } else {
                            cb(null, { status: 200, message: "Application updated susccessfully" });
                        }
                    }
                );

            }
        });
    } else {
        cb({ status: 400, message: "user is not a superadmin" });
    }
}

function updateTeam(req, cb) {
    var role = req.user.role;
    if (role && role == "ADMIN") {
        dbObj.getById(TeamsModel, { _id: req.query.teamid }, function (error, teamResp) {
            if (error) {
                cb({
                    status: 400,
                    message: "Team not found",
                    error: error.message,
                });
            } else {
                if (!teamResp) {
                    return cb({ status: 400, message: "Team not matched" });
                }
                var updateObj = {
                    lastUpdatedOn: new Date(),
                };
                if (req.body.name) {
                    updateObj.name = req.body.name
                }
                if (req.body.description) {
                    updateObj.description = req.body.description
                }

                dbObj.update(
                    TeamsModel,
                    updateObj,
                    { _id: req.query.teamid },
                    function (err, response) {
                        if (err) {
                            cb({ status: 400, message: err.message });
                        } else {
                            cb(null, { status: 200, message: "Team updated susccessfully" });
                        }
                    }
                );

            }
        });
    } else {
        cb({ status: 400, message: "user is not a admin" });
    }
}

module.exports.addAdmin = addAdmin;
module.exports.addOrganization = addOrganization;
module.exports.getOrganization = getOrganization;
module.exports.addTeams = addTeams;
module.exports.addTeamMember = addTeamMember;
module.exports.getTeams = getTeams;
module.exports.updateOrganization = updateOrganization;
module.exports.updateApplication = updateApplication;
module.exports.updateTeam = updateTeam;
