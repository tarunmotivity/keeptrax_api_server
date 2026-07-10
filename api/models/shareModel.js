'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({

    isAlwaysOn: Boolean,

    isSharingImages: Boolean,

    views: [],

    type: String,

    name: String,

    bookmark: {
        type: Schema.Types.ObjectId,
        ref: 'Trips'
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },

    recipients: [{
    email: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null
    }
}],

    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organizations'
    },

    expiresAt: Date,

    expiresAtInMilliSeconds: Number,

    createdOn: Date,

    lastupdatedOn: Date

    

}, {
    strict: true,
    read: 'secondaryPreferred'
});

module.exports = mongoose.model('Shares', schema);