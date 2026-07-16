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
module.exports.getUserTrax = (req, res) => {
    TraxService.getUserTrax(req, (err, resp) => {
        if (err) {
            res.send(err);
        } else {
            res.send(resp);
        }
    });
}
module.exports.searchUserTrax = (req, res) => {

    TraxService.searchUserTrax(req, (err, resp) => {

        if (err) {
            res.send(err);
        } else {
            res.send(resp);
        }

    });

};