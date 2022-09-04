var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organizations',
        required: true,
        index: true
    },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Applications',
        required: true,
        index: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    createdOn: {
        type: Date
    },
    lastUpdatedOn: {
        type: Date
    },
}, {
    read: 'nearest'
});

schema.index({
    organization: 1,
    application: 1,
    adminId: 1
});
schema.index({
    organization: 1,
    name: 1
}, {
    unique: true,
    name: 'unique_org_team'
});
module.exports = mongoose.model('Teams', schema);
