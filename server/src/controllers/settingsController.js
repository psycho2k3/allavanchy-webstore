const SiteSettings = require("../models/SiteSettings");

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};