const preferencesService = require("../services/preferenceService");

exports.getPreferences = async (req, res) => {
    try {
        const result = await preferencesService.getPreferences(req.params.id);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

exports.updatePreferences = async (req, res) => {
    try {

        const result = await preferencesService.updatePreferences(
            req.params.id,
            req.body
        );

        res.status(200).json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
};