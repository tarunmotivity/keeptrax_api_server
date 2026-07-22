const Images = require("../models/imagesModel");
const UserPlaces = require("../models/userPlacesModel");

exports.getImages = async (userId, query) => {

    let filter = {
        user: userId
    };

    if (query.visitid) {
        filter.visits = query.visitid;
    }

    if (query.placeid) {
        filter.userPlaces = query.placeid;
    }

    const images = await Images.find(filter)
        .populate("userPlaces", "name")
        .lean();

    return images.map(image => ({
        imageId: image._id,
        image: image.image,
        thumbnail: image.thumbnail,
        placeId: image.userPlaces?._id,
        name: image.userPlaces?.name || "",
        traxId: image.visits
    }));
};

exports.uploadImage = async (userId, body, file, req) => {

    const place = await UserPlaces.findById(body.placeId);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/images/${file.filename}`;

    const image = await Images.create({

        user: userId,

        userPlaces: body.placeId,

        visits: body.traxId,

        image: imageUrl,

        thumbnail: imageUrl,

        lastUpdatedOn: new Date()

    });

    return {

        imageId: image._id,

        image: image.image,

        thumbnail: image.thumbnail,

        placeId: image.userPlaces,

        name: place ? place.name : "",

        traxId: image.visits

    };
};
const fs = require("fs");
const path = require("path");

exports.deleteImage = async (userId, imageId) => {

    const image = await Images.findOne({
        _id: imageId,
        user: userId
    });

    if (!image) {
        throw new Error("Image not found.");
    }

    // Delete physical file
    if (image.image) {

        const fileName = path.basename(image.image);

        const filePath = path.join(
            __dirname,
            "../../uploads/images",
            fileName
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await Images.deleteOne({
        _id: imageId
    });

    return {
        success: true,
        message: "Image deleted successfully."
    };
};