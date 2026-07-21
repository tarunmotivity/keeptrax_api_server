const UserPreferences = require("../models/userPreferencesModel");

exports.getPreferences = async (userId) => {
    let preferences = await UserPreferences.findOne({
        account: userId
    });

    if (!preferences) {
        return {
            preferences: {
                syncOnWifi: true,
                uploadPhotos: false,
                locationTracking: true,
                syncCalendar: false,
                dailysnapshot: true,
                eightPMLocalReminder: false,
                photosSyncStartDate: null,
                photosSyncEndDate: null
            }
        };
    }

    return {
        preferences: {
            syncOnWifi: preferences.syncOnWifi,
            uploadPhotos: preferences.uploadPhotos,
            locationTracking: preferences.locationTracking,
            syncCalendar: preferences.syncCalendar,
            dailysnapshot: preferences.dailysnapshot,
            eightPMLocalReminder: preferences.eightPMLocalReminder,
            photosSyncStartDate: preferences.photosSyncStartDate,
            photosSyncEndDate: preferences.photosSyncEndDate
        }
    };
};

exports.updatePreferences = async (userId, body) => {

    const preferences = await UserPreferences.findOneAndUpdate(
        { account: userId },
        {
            syncOnWifi: body.syncOnWifi,
            uploadPhotos: body.uploadPhotos,
            locationTracking: body.locationTracking,
            syncCalendar: body.syncCalendar,
            dailysnapshot: body.dailysnapshot,
            eightPMLocalReminder: body.eightPMLocalReminder,
            photosSyncStartDate: body.photosSyncStartDate,
            photosSyncEndDate: body.photosSyncEndDate,
            lastUpdatedOn: new Date()
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    return true;
};