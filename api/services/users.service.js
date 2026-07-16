var nodemailer = require("nodemailer");
var ejs = require("ejs");
var path = require("path");
var _ = require("lodash");
var User = require("../models/userModel");
var Visits = require("../models/visitsModel");
var UserPlaces = require("../models/userPlacesModel");
var dbObj = require("../core/databaseFunction");
var config = require("../../config/config");
var TraxService = require("./trax.service");
const email = require("./emailContant.service");
var logger = config.getLogger(__filename);
var CWD = process.cwd();
const moment = require("moment");
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const Share = require('../models/shareModel');
const Trip = require('../models/tripModel');
const mongoose = require("mongoose");

async function getAllUsers(req, cb) {
  try {
    const query = {
      manager_id: req.user._id.toString(),
    };
    const resp = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "applications",
          localField: "application",
          foreignField: "_id",
          as: "application",
        },
      },
      {
        $lookup: {
          from: "organizations",
          localField: "organization",
          foreignField: "_id",
          as: "organization",
        },
      },
    ]);
    cb(null, { status: 200, data: resp, message: "List" });
  } catch (err) {
    cb({ status: 400, message: err.message });
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
  // dbObj.getAll(User, query, (err, resp) => {
  //     if (err) {
  //         logger.error("Error while getting all the users", err);
  //         cb({ status: 400, message: err.message })
  //         // cb(err)
  //     } else {
  //         cb(null, { status: 200, data: resp, message: "List" })
  //         // cb(null, resp)
  //     }
  // })
  // } else {
  //     cb({ code: 404, error: "managerid and organizationid are required" })
  // }
}

function updateUser(req, userObj, cb) {
  if (!userObj.email) {
    return cb({ status: 400, message: "Email is required" });
  }
  dbObj.getById(User, { email: userObj.email }, function (error, userResp) {
    if (error) {
      cb({
        status: 400,
        message: "You are not eligible to update this user",
        error: error.message,
      });
      // cb(error)
    } else {
      if (!userResp) {
        return cb({ status: 400, message: "Manager not matched" });
      }
      if (req.user._id == userResp.manager_id || req.user.team_id === userResp.team_id) {
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
          updateObj["birthDate"] = moment(userObj.birthDate).format(
            "YYYY-MM-DD"
          );
        }
        if (userObj.role) {
          updateObj["role"] = userObj.role;
        }
        const role = req.user.role;
        if (role && role == "SUPERADMIN") {
          if (userObj.organization) {
            updateObj["organization"] = userObj.organization;
          }
          if (userObj.application) {
            updateObj["application"] = userObj.application;
          }
        }
        if (role && role == "ADMIN") {
          if (userObj.team_id) {
            updateObj.team_id = userObj.team_id;
          }
        }

        dbObj.update(
          User,
          updateObj,
          { email: userObj.email },
          function (err, response) {
            if (err) {
              cb({ status: 400, message: err.message });
              // cb(err)
            } else {
              cb(null, { status: 200, message: "User updated susccessfully" });
            }
          }
        );
      } else {
        cb({
          status: 400,
          message: "You are not eligible to update this user",
        });
      }
    }
  });
}

function deleteUser(headers, cb) {
  dbObj.getById(User, { email: headers.email }, function (error, userResp) {
    if (error) {
      cb(error);
    } else {
      if (headers.managerid == userResp.manager_id) {
        var updateObj = {
          manager_id: null,
        };
        dbObj.update(
          User,
          updateObj,
          { email: headers.email },
          function (err, response) {
            if (err) {
              cb(err);
            } else {
              cb(null, { status: 200, message: "User deleted susccessfully" });
            }
          }
        );
      } else {
        cb({
          status: 400,
          message: "You are not eligible to delete this user",
        });
      }
    }
  });
}

function addUser(body, cb) {
  try {
    const password = Math.random().toString(36).slice(-10);
    var userPayload = {
      birthDate: moment(body.birthDate).format("YYYY-MM-DD"),
      email: body.email,
      team_id: body.team_id || "",
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
      manager_id: body.manager_id,
    };
    var model = new User(userPayload);
    dbObj.save(model, (err, resp) => {
      if (err) {
        logger.error("Error while addUser", err);
        cb({ status: 400, message: err.message });
      } else {
        email.welcomeMail(body.lastname, password, body.email);
        cb(null, {
          status: 200,
          data: resp,
          message: "User added susccessfully",
        });
      }
    });
  } catch (err) {
    cb({ status: 400, message: err.message });
    logger.error("profileManage", err.message);
  }
}

function updatePassword(req, cb) {
  try {
    bcrypt.compare(
      req.body.currentPassword,
      req.user.password,
      function (err, result) {
        if (result) {
          bcrypt.hash(req.body.newPassword, 10, async function (err, hash) {
            if (err) {
              cb({ status: 400, message: err.message });
            } else {
              var updateObj = {
                password: hash,
              };
              dbObj.update(
                User,
                updateObj,
                { email: req.user.email },
                function (err, response) {
                  if (err) {
                    cb({ status: 400, message: err.message });
                    // cb(err)
                  } else {
                    cb({
                      status: 200,
                      data: response,
                      message: "password updated susccessfully",
                    });
                    // cb(null, response)
                  }
                }
              );
            }
          });
        } else {
          cb({ status: 400, message: "Current password doesn't match" });
        }
        // result == true
      }
    );
    // console.log(req.body)
    // console.log(req.user)
  } catch (err) {
    cb({ status: 400, message: err.message });
    logger.error("profileManage", err.message);
  }
}

function getUserById(req, userObj, cb) {
  dbObj.getById(User, { _id: userObj.id }, function (error, userResp) {
    if (error) {
      cb({
        status: 400,
        message: "You are not eligible to update this user",
        error: error.message,
      });
      // cb(error)
    } else {
      if (!userResp) {
        return cb({ status: 400, message: "Manager not matched" });
      }
      // if (req.user._id != userResp.manager_id) {
      //     return cb({ status: 400, message: "your manager ID is not allowed " })
      // }
      cb(null, { status: 200, data: userResp });
    }
  });
}

async function getManagerUser(req, cb) {
  try {
    const resp = await User.find({
      team_id: req.user.team_id,
      role: "USER",
    }).sort({ _id: -1 });
    cb(null, { status: 200, data: resp, message: "List-kk" });
  } catch (err) {
    cb({ status: 400, message: err.message });
  }
}

async function getBookmarks(userId, cb) {

  try {

    const trips = await Trip.find({
      account: userId
    }).sort({ createdOn: -1 });

    const bookmarks = trips.map(item => ({
      id: item._id,
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime
    }));

    cb(null, { bookmarks });

  } catch (err) {
    cb(err);
  }

}

async function createShare(req, payload, cb) {

  try {

    const share = new Share({

      sender: req.params.id,

      organization: req.user.organization,

      bookmark: payload.bookmark || null,

      recipients: payload.recipients || [],

      name: payload.name,

      type: payload.type,

      isAlwaysOn: payload.isAlwaysOn,

      isSharingImages: payload.isSharingImages,

      expiresAt: new Date(Date.now() + Number(payload.expiresAt)),

      expiresAtInMilliSeconds: Number(payload.expiresAt),

      createdOn: new Date(),

      lastupdatedOn: new Date(),

      views: []

    });

    const response = await share.save();

    cb(null, response);

  } catch (err) {

    cb({
      status: 400,
      message: err.message
    });

  }

}

async function getShares(userId, cb) {

  try {

    const sent = await Share.find({
      sender: userId
    })
      .populate("bookmark")
      .lean();

    const user = await User.findById(userId);

    const received = await Share.find({
      "recipients.email": user.email
    })
      .populate("sender")
      .populate("bookmark")
      .lean();

    cb(null, {
      sent,
      received
    });

  } catch (err) {

    cb(err);

  }

}

async function getProfile(userId, cb) {

  try {

    const user = await User.findById(userId).lean();

    if (!user) {
      return cb({
        status: 404,
        message: "User not found"
      });
    }

    cb(null, user);

  } catch (err) {

    cb({
      status: 400,
      message: err.message
    });

  }

}

async function updateProfile(userId, body, cb) {

  try {

    await User.findByIdAndUpdate(
      userId,
      {
        firstname: body.firstname,
        lastname: body.lastname,
        mobile: body.mobile,
        birthDate: body.birthDate,
        gender: body.gender,
        lastUpdatedOn: new Date()
      }
    );

    cb(null, {
      message: "Profile updated successfully"
    });

  } catch (err) {

    cb({
      status: 400,
      message: err.message
    });

  }

}

async function logout(userId, cb) {
  try {
    cb(null, {
      status: 200,
      logoutstatus: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    cb({
      status: 400,
      message: err.message
    });
  }
}
async function getCategories(cb) {

  const categories = [

    { _id: 1, internalCat: "Restaurant" },
    { _id: 2, internalCat: "Hotel" },
    { _id: 3, internalCat: "Cafe" },
    { _id: 4, internalCat: "Office" },
    { _id: 5, internalCat: "Home" },
    { _id: 6, internalCat: "Shopping" },
    { _id: 7, internalCat: "Hospital" },
    { _id: 8, internalCat: "School" },
    { _id: 9, internalCat: "Airport" },
    { _id: 10, internalCat: "Gym" },
    { _id: 11, internalCat: "Other" }

  ];

  cb(null, categories);

}
async function createBookmark(userId, payload, cb) {

  try {

    const trip = new Trip({
      account: userId,
      name: payload.name,
      startTime: new Date(Number(payload.startTime)),
      endTime: new Date(Number(payload.endTime)),
      createdOn: new Date(),
      lastUpdatedOn: new Date()
    });

    const response = await trip.save();

    cb(null, {
      status: 200,
      response,
      message: "Bookmark created successfully"
    });

  } catch (err) {

    cb({
      status: 400,
      message: err.message
    });

  }

}
async function getPlaces(req, cb) {

  
  try {

    const query = {
      account: req.params.id,
      activeStatus: true
    };

    if (req.query.placeIds) {

      const ids = req.query.placeIds
        .split(",")
        .map(id => new mongoose.Types.ObjectId(id));

      query._id = {
        $in: ids
      };

    }
    

    const places = await UserPlaces.find(query)
      .sort({ createdOn: -1 });

    cb(null, {
      places: places
    });

  } catch (err) {

    cb({
      status: 400,
      message: err.message
    });

  }

}
async function searchPlaces(req, cb) {

    try {

        const searchText = req.query.q || "";

        const places = await UserPlaces.find({
            account: req.params.id,
            activeStatus: true,
            $or: [
                {
                    name: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    locality: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    sublocality: {
                        $regex: searchText,
                        $options: "i"
                    }
                }
            ]
        }).sort({ createdOn: -1 });

        cb(null, {
            places: places
        });

    } catch (err) {

        cb({
            status: 400,
            message: err.message
        });

    }

}
async function getAnalytics(req, cb) {

    try {

        const userId = req.params.id;

        const totalVisits = await Visits.countDocuments({
            account: userId,
            activeStatus: true
        });

        const totalPlaces = await UserPlaces.countDocuments({
            account: userId,
            activeStatus: true
        });

        const topPlaces = await Visits.aggregate([
            {
                $match: {
                    account: new mongoose.Types.ObjectId(userId),
                    activeStatus: true
                }
            },
            {
                $group: {
                    _id: "$userPlace",
                    visits: { $sum: 1 }
                }
            },
            {
                $sort: {
                    visits: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "userplaces",
                    localField: "_id",
                    foreignField: "_id",
                    as: "place"
                }
            },
            {
                $unwind: "$place"
            },
            {
                $project: {
                    _id: 0,
                    placeId: "$place._id",
                    placeName: "$place.name",
                    visits: 1
                }
            }
        ]);

        cb(null, {
            totalVisits,
            totalPlaces,
            topPlaces
        });

    } catch (err) {

        cb({
            status: 400,
            message: err.message
        });

    }

}

module.exports.getAnalytics = getAnalytics;
module.exports.searchPlaces = searchPlaces;
module.exports.getPlaces = getPlaces;
module.exports.createBookmark = createBookmark;
module.exports.getCategories = getCategories;
module.exports.logout = logout;
module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
module.exports.getShares = getShares;
module.exports.createShare = createShare;
module.exports.getBookmarks = getBookmarks;
module.exports.getAllUsers = getAllUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.addUser = addUser;
module.exports.updatePassword = updatePassword;
module.exports.getUserById = getUserById;
module.exports.getManagerUser = getManagerUser;
