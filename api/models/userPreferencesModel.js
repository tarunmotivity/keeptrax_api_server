var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true
    },

    syncOnWifi: {
        type: Boolean,
        default: true
    },

    uploadPhotos: {
        type: Boolean,
        default: false
    },

    locationTracking: {
        type: Boolean,
        default: true
    },

    syncCalendar: {
        type: Boolean,
        default: false
    },

    dailysnapshot: {
        type: Boolean,
        default: true
    },

    eightPMLocalReminder: {
        type: Boolean,
        default: false
    },

    photosSyncStartDate: {
        type: Number,
        default: null
    },

    photosSyncEndDate: {
        type: Number,
        default: null
    },

    createdOn: {
        type: Date,
        default: Date.now
    },

    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UserPreferences", schema);