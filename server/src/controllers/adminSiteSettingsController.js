const SiteSettings = require("../models/SiteSettings");

const allowedModes = ["full", "landing"];

exports.getSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const {
            site_mode,
            landing_button_label,
            hero_eyebrow,
            hero_heading,
            hero_subtext,
            hero_button_label
        } = req.body;

        if (site_mode !== undefined && !allowedModes.includes(site_mode)) {
            return res.status(400).json({
                message: "Invalid site mode"
            });
        }

        const settings = await SiteSettings.updateSettings({
            site_mode,
            landing_button_label,
            hero_eyebrow,
            hero_heading,
            hero_subtext,
            hero_button_label
        });

        res.json(settings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateLandingImage = async (req, res) => {
    try {
        if (!req.body.image_url) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const settings = await SiteSettings.updateLandingImage(req.body.image_url);
        res.json(settings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateHeroImage = async (req, res) => {
    try {
        if (!req.body.image_url) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const settings = await SiteSettings.updateHeroImage(req.body.image_url);
        res.json(settings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};