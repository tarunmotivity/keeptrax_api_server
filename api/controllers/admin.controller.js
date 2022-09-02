var AdminService = require('../services/admin.service')

module.exports.addOrganization = (req, res) => {
    AdminService.addOrganization(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.getOrganization = (req, res) => {
    AdminService.getOrganization(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.addAdmin = (req, res) => {
    AdminService.addAdmin(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.addTeams = (req, res) => {
    AdminService.addTeams(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}

module.exports.addTeamMember = (req, res) => {
    AdminService.addTeamMember(req, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}