// var MILLISECONDS_TO_HOURS = 1000 * 60 * 60;

// var _ = require('underscore');
// var InternalCategories = require('./internalcategories'),
//     Visits = require('./visits'),
//     solrClient = require('../controllers/helpers/solr').getInstance();

// Import Mangoose Dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var logger = require('log4js').getLogger(__filename);

var schema = new Schema({
    account: {
        type: ObjectId,
        ref: 'Users'
    },
    notes: {
        type: String,
        max: 500,
        // index: true
    },
    loc: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    postal_code: {
        type: String
    },
    post_box: {
        type: String
    },
    name: {
        type: String,
        required: true,
        // index: true
    },
    administrative_area_level_1: {
        type: String,
        required: true,
        // index: true
    },
    administrative_area_level_2: {
        type: String
    },
    administrative_area_level_3: {
        type: String
    },
    locality: {
        type: String,
        required: true,
        // index: true
    },
    street_number: {
        type: String
    },
    street_address: {
        type: String
    },
    vicinity: {
        type: String
    },
    sublocality: {
        type: String,
        // index: true
    },
    sublocality_level_1: {
        type: String
    },
    sublocality_level_2: {
        type: String
    },
    sublocality_level_3: {
        type: String
    },
    sublocality_level_4: {
        type: String
    },
    sublocality_level_5: {
        type: String
    },
    colloquial_area: {
        type: String
    },
    subpremise: {
        type: String
    },
    transit_station: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    intersection: {
        type: String
    },
    neighborhood: {
        type: String
    },
    natural_feature: {
        type: String
    },
    postal_code_prefix: {
        type: String
    },
    formatted_address: {
        type: String
    },
    route: {
        type: String
    },
    room: {
        type: String
    },
    floor: {
        type: String
    },
    categories: {
        type: [String],
        // index: true
    },
    internalCat: {
        type: [String],
        // index: true
    },
    count: {
        type: Number,
        default: 0
    },
    activeStatus: {
        type: Boolean,
        default: true
    }, // becomes true after activation
    createdOn: {
        type: Date,
        default: Date.now()
    },
    lastUpdatedOn: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: 0
    }
}, {

    read: 'nearest'
});
schema.on('index', function (err) {
    if (err) console.error(err); // error occurred during index creation
})


schema.index({
    account: 1,
    name: 1,
    street_number: 1,
    street_address: 1,
    route: 1,
    administrative_area_level_1: 1,
    sublocality: 1,
    country: 1
}, {
    unique: true,
    name: 'unique_address'
});

module.exports = mongoose.model('UserPlaces', schema);