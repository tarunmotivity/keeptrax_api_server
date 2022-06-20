'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 Organizations Schema to save details of an organization
 who want to use/consume TimeTrax API
 Helps to deliver TT API Services as a Product 
 */

var schema = new Schema({
  name: {
    type: String,
    min: 2,
    max: 150,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  website: {
    type: String,
    max: 500,
    required: true
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
  }
}, {
  read: 'nearest'
});

schema.index({
  name: 1,
  website: 1
}, {
  unique: true
});

var blankValidation = function(value) {
  if (!value || value.trim() == '') {
    try {
      return false;
    } catch (error) {
      return false;
    }
  }
};
schema.path('name').validate(function(value) {
  return blankValidation(value);
}, 'Invalid value for name');

schema.path('website').validate(function(value) {
  return blankValidation(value);
}, 'Invalid value for website');

module.exports = mongoose.model('Organizations', schema);