var UserService = require('../services/users.service');
var config = require('../../config/config');
var logger = config.getLogger(__filename);



module.exports.getAllUsers = (req, res) => {
    UserService.getAllUsers(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.updateUser = (req, res) => {
    UserService.updateUser(req, req.body, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.deleteUser = (req, res) => {
    UserService.deleteUser(req.headers, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

exports.addUser = (req, res) => {
   
    const userPayload = {
        ...req.body,
        tripId: 1,
        manager_id:req.user._id,
        organization: req.user.organization,
        application: req.user.application,
        lockUntil: 0,
        oauth_id: null
    }
    UserService.addUser(userPayload, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

exports.updatePassword = (req, res) => {
    UserService.updatePassword(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })

}
