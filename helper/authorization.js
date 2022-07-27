const UserSession = require('../api/models/usersessions');
const User = require('../api/models/userModel');
const organization = require('../api/models/organizationModel');

exports.authorizeUser = (req, res, next) => {
    const basicheaders = req.headers['basic'];
    const apiKey = req.headers['apiKey'] || req.headers['apikey'];
    if (!basicheaders || !apiKey) {
        res.json({ status: 401, message: "Unauthorized Request" });
        return;
    } else {
        var encodedString = new Buffer(basicheaders, 'base64').toString('ascii');
        if (!encodedString || encodedString.indexOf(':') < 0) {
            res.json({ status: 401, message: "Unauthorized Request" });
        } else {
            var basicValues = encodedString.split(':');
            var secretKey = basicValues[0];
            var token = basicValues[1];
            // var isMobile = Util.isMobile(req.headers['user-agent']);
            UserSession.findOne({
                token: token,
                activeStatus: true,
                // application: req.headers['app'],
                // organization: req.headers['org']
            }).populate({
                path: 'application',
                match: {
                    secretKey: secretKey
                }
            }).select({
                _id: 1,
                user: 1,
                application: 1
            }).lean().exec(async function (error, doc) {
                if (error) {
                    res.json({ status: 401, message: "Unauthorized Request" });

                } else {
                    try {
                        if (doc) {
                            const resp = await Promise.all([User.findOne({ _id: doc.user }), organization.findOne({ _id: doc.application.organization })]);
                            if (resp[0] && resp[1]) {
                                req.user = resp[0];
                                req.organization = resp[1];
                                next();
                            } else {
                                res.json({ status: 401, message: "Unauthorized Request" });
                            }
                        } else {
                            res.json({ status: 401, message: "Unauthorized Request" });
                        }
                    } catch (error) {
                        res.json({ status: 401, message: "Unauthorized Request" });
                    }                    
                }
            })
        }
    }

}

