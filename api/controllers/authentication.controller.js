var AuthenticationService = require('../services/authentication.service')

module.exports.appTest = (req, res) => {
    AuthenticationService.appTest((err, resp) => {
        res.send(resp)
    })

}

module.exports.signup = (req, res) => {

    AuthenticationService.signup(
        req.headers,
        req.body,
        function (err, response) {

            if (err) {
                return res.status(err.status || 500).json(err);
            }

            res.status(200).json(response);
        }
    );
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
module.exports.login = (req, res) => {
    AuthenticationService.login(req.headers, (err, resp) => {
        if (err) {
            res.send(err);
        } else {
            res.send(resp);
        }
    });
};