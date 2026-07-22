var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },

    userPlaces: {
        type: Schema.Types.ObjectId,
        ref: "UserPlaces",
        required: true
    },

    visits: {
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

    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Images", schema);