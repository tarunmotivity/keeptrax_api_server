const Images = require("../models/imagesModel");
const UserPlaces = require("../models/userPlacesModel");

exports.getImages = async (userId, query) => {

    let filter = {
        account: userId
    };

    if (query.visitid) {
        filter.traxId = query.visitid;
    }

    if (query.placeid) {
        filter.placeId = query.placeid;
    }

    if (query.startTime && query.endTime) {

        filter.timestamp = {
            $gte: new Date(query.startTime).getTime(),
            $lte: new Date(query.endTime).getTime()
        };

    }

    const images = await Images.find(filter).lean();

    const result = [];

    for (const image of images) {

        const place = await UserPlaces.findById(image.placeId);

        result.push({
            imageId: image._id,
            image: image.image,
            thumbnail: image.thumbnail,
            placeId: image.placeId,
            name: place ? place.name : "",
            traxId: image.traxId
        });

    }

    return result;
};