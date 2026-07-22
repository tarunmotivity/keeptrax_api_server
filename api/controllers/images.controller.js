const imageService = require("../services/imagesService");

exports.getImages = async (req, res) => {

    try {

        const result = await imageService.getImages(
            req.params.id,
            req.query
        );

        res.status(200).json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

};

exports.uploadImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                error: "Image file is required."
            });

        }

        const result =
            await imageService.uploadImage(
                req.params.id,
                req.body,
                req.file,
                req
            );

        res.status(201).json(result);

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

};
exports.deleteImage = async (req, res) => {
    try {

        const result = await imageService.deleteImage(
            req.params.id,
            req.params.imageId
        );

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message
        });
    }
};