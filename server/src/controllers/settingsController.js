const SiteSettings = require("../models/SiteSettings");
const { getCheckoutConfig } = require("../config/checkout");

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json({
            ...settings,
            checkout: getCheckoutConfig()
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};