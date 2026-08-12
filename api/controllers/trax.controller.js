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
module.exports.deleteTrax = (req, res) => {

    TraxService.deleteTrax(

        req.params.id,

        req.params.traxId,

        (err, resp) => {

            if (err) {

                res.send(err);

            } else {

                res.send(resp);

            }

        }

    );

};
module.exports.updateTrax = (req, res) => {

    TraxService.updateTrax(

        req.params.id,

        req.params.placeId,

        req.params.traxId,

        req.body,

        (err, resp) => {

            if (err) {

                res.send(err);

            } else {

                res.send(resp);

            }

        }

    );

};
exports.createTrax = function(req, res) {
    TraxService.createTrax(req.params.id, req.body, function(err, response) {
        if (err) {
            return res.status(err.status || 400).json(err);
        }
        res.json(response);
    });
};