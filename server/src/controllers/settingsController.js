const SiteSettings = require("../models/SiteSettings");
const { getCheckoutConfig } = require("../config/checkout");
const { sendError } = require("../utils/http");

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json({
            ...settings,
            checkout: getCheckoutConfig()
        });
    } catch (error) {
        return sendError(res, error, "Failed to fetch settings");
    }
};
