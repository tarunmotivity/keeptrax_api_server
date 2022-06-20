var AuthenticationService = require('../services/authentication.service')

module.exports.appTest = (req, res) => {
    AuthenticationService.appTest((err, resp) => {
        res.send(resp)
    })

}

module.exports.signup = (req, res) => {
    AuthenticationService.signup(req.headers, req.body, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.getOrganizations = (req, res) => {
    AuthenticationService.getOrganizations((err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}