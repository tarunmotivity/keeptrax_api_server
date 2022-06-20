var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var schema = new Schema({
    birthDate: {
        type: Date
    },
    email: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    tripId: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
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
    activeStatus: {
        type: Boolean,
        default: false
    }, // becomes true after activation
    createdOn: {
        type: Date
    },
    lastUpdatedOn: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Number
    },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'USER'],
        default: 'USER'
    },
    oauth_id: {
        type: String
    },
    oauth_provider: {
        type: String
    },
    image_url: {
        type: String
    },
    manager_id: {
        type: String

    },
    url: {
        type: String
    },
    gender: {
        type: String
    },
    quota_limit: {
        type: Number,
        default: 300
    }
}, {
    read: 'nearest'
});

schema.index({
    organization: 1,
    email: 1
}, {
    unique: true,
    name: 'unique_org_user'
});

schema.index({
    application: 1
});

module.exports = mongoose.model('Users', schema);