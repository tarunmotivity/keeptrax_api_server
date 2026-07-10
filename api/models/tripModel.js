'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    activeStatus: Boolean,
    name: String,
    startTime: Date,
    endTime: Date,
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdOn: Date,
    lastUpdatedOn: Date
}, {
    strict: true,
    read: 'secondaryPreferred'
});

module.exports = mongoose.model('Trips', schema);