var TraxService = require("../services/trax.service")

module.exports.getAllTrax = (req, res) => {
    TraxService.getAllTrax(req.headers, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            res.send(resp)
        }
    })
}