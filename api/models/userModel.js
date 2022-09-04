var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10,
    bcrypt = require('bcrypt');

var schema = new Schema({
    birthDate: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
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
        default: true
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
    user_status: {
        type: String,
        default: "online"
    },
    image_url: {
        type: String
    },
    manager_id: {
        type: String
    },
    team_id:{
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

schema.pre('save',  function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(user.password, 10,async function (err, hash) {
            if (err)
                return next(err);
            const email = await checkEmail(user.email);
            if (email && email.email === user.email) {
                next(new Error('Email already exists'));
            } else {
                user.password = hash;
                next();
            }
        });
    });
});

const UserSchema = mongoose.model('Users', schema);
const checkEmail = async (email) => {
    return await UserSchema.findOne({}).where('email').equals(email);
}
module.exports = UserSchema;