var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

  var schema = new Schema({
    application: {
      type: ObjectId,
      ref: 'Applications',
      required: true,
      index: true
    },
    organization: {
      type: ObjectId,
      ref: 'Organizations',
      required: true,
      index: true
    },
    user: {
      type: ObjectId,
      ref: 'Users',
      index: true
    }, // Users
    token: {
      type: String,
      index: true
    },
    expiresAt: {
      type: Date
    },
    userAgent: {
      type: String
    },
    isMobile: {
      type: Boolean,
      default: true
    },
    activeStatus: {
      type: Boolean,
      default: true
    },
    createdOn: {
      type: Date
    },
    lastUpdatedOn: {
      type: Date,
      default: Date.now()
    }
  });

  module.exports = mongoose.model('UserSessions', schema);