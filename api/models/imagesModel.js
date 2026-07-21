var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({

    account: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },

    placeId: {
        type: Schema.Types.ObjectId,
        ref: "UserPlaces",
        required: true
    },

    traxId: {
        type: Schema.Types.ObjectId,
        ref: "Visits",
        required: true
    },

    image: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    timestamp: {
        type: Number,
        default: Date.now
    },

    lat: Number,

    lng: Number,

    createdOn: {
        type: Date,
        default: Date.now
    },

    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Images", schema);