'use strict';

var MILLISECONDS_TO_HOURS = 1000 * 60 * 60;

// Import Mangoose Dependencies
var mongoose = require('mongoose'),
  Schema = mongoose.Schema


var schema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  notes: {
    type: String,
    max: 500
  },
  userPlace: {
    type: Schema.Types.ObjectId,
    ref: 'UserPlaces',
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date,
    required: true
  },
  activeStatus: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  lastUpdatedOn: {
    type: Date
  }
}, {
  strict: true,
  read: 'secondaryPreferred'
});

schema.index({
 account:1,
 userPlace:1,
 entryTime:-1,
 exitTime:-1,

});

module.exports = mongoose.model('Visits', schema);
