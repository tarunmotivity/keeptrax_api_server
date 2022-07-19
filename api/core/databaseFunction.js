var config = require('../../config/config')
var Organizations = require('../models/organizationModel')
var logger = config.getLogger(__filename)

module.exports.getAll = (model, query, cb) => {
    if (!query) query = {};
    model
        .find(query)
        .exec((err, results) => {
            if (err) {
                logger.error("Error while getting all the records", err)
                cb(err)
            } else {
                cb(null, results)
            }
        });
};
module.exports.getById = (model, query, cb) => {
    if (!query) query = {};
    model
        .findOne(query)
        .exec((err, resp) => {
            if (err) {
                logger.error('Error while getting record based on Id ', err);
                cb(err)
            } else {
                cb(null, resp)
            }
        });
}

module.exports.save = (model, cb) => {
    model.save(function (err, resp) { // need to be reviewed and fixed check_key
        if (err) {
            logger.error('Error while saving', err);
            cb(err)
        } else {
            cb(null, resp)
        }
    });
}

module.exports.update = function (model, modelObj, query, cb) {
    if (!query) query = {};
    model.findOneAndUpdate(query, modelObj, {
        new: true
    }, function (err, resp) {
        if (err) {
            logger.error('Error while updating data ', err);
            cb(err)
        } else {
            cb(null, resp)
        }
    });
};

module.exports.delete = function (model, query, cb) {
    if (!query) query = {};
    model.findOneAndRemove(query, function (err, resp) {
        if (err) {
            logger.error('Error while deleting data ', err);
            cb(err)
        } else {
            cb(null, resp)
        }
    });
};

module.exports.getAndPopulate = function (model, query, populateQuery, cb) {
    if (!query) query = {};
    model.find(query)
        .populate(populateQuery)
        .exec(function (err, resp) {
            if (err) {
                logger.error('Error while deleting data ', err);
                cb(err)
            } else {
                cb(null, resp)
            }
        });
}

module.exports.getCount = function (model, query, cb) {
    if (!query) query = {};
    model.find(query)
        .count()
        .exec(function (err, resp) {
            if (err) {
                logger.error('Error while getting count ', err);
                cb(err)
            } else {
                cb(null, resp)
            }
        });
}


