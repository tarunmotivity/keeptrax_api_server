var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organizations'
    }, // Organizations
    name: {
        type: String,
        max: 300,
        required: true
    },
    description: {
        type: String,
        max: 500,
        required: true
    },
    apiKey: {
        type: String,
        index: true
    },
    bundleId: {
        type: String
    },
    secretKey: {
        type: String
    },
    activeStatus: {
        type: Boolean
    },
    createdOn: {
        type: Date
    },
    lastUpdatedOn: {
        type: Date,
        default: Date.now()
    },
    callbackurl: {
        type: String
    }
}, {
    read: 'secondaryPreferred'
});


module.exports = mongoose.model('Applications', schema);
