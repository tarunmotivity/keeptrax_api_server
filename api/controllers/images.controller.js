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