const SiteSettings = require("../models/SiteSettings");
const { sendError } = require("../utils/http");

const allowedModes = ["full", "landing"];

const textFields = [
    "landing_button_label",
    "hero_eyebrow",
    "hero_heading",
    "hero_subtext",
    "hero_button_label"
];

exports.getSettings = async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json(settings);
    } catch (error) {
        return sendError(res, error, "Failed to fetch settings");
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
        } = req.body || {};

        if (site_mode !== undefined && !allowedModes.includes(site_mode)) {
            return res.status(400).json({
                message: "Invalid site mode"
            });
        }

        const invalidField = textFields.find((field) => {
            const value = (req.body || {})[field];
            return value !== undefined && value !== null && typeof value !== "string";
        });

        if (invalidField) {
            return res.status(400).json({
                message: `${invalidField} must be text`
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
        return sendError(res, error, "Failed to update settings");
    }
};

exports.updateLandingImage = async (req, res) => {
    try {
        if (!req.body || !req.body.image_url) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const settings = await SiteSettings.updateLandingImage(req.body.image_url);
        res.json(settings);
    } catch (error) {
        return sendError(res, error, "Failed to update landing image");
    }
};

exports.updateHeroImage = async (req, res) => {
    try {
        if (!req.body || !req.body.image_url) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const settings = await SiteSettings.updateHeroImage(req.body.image_url);
        res.json(settings);
    } catch (error) {
        return sendError(res, error, "Failed to update hero image");
    }
};
