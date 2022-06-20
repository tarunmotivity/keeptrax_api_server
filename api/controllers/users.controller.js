var UserService = require('../services/users.service');
var config = require('../../config/config')
var logger = config.getLogger(__filename)


module.exports.getAllUsers = (req, res) => {
    UserService.getAllUsers(req.headers, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}
