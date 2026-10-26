const Collection = require("../models/Collection");
const { isValidId, sendError } = require("../utils/http");

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const invalidId = (res) => res.status(400).json({
    message: "Invalid collection id"
});

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.getAll();
        res.json(collections);
    } catch (error) {
        return sendError(res, error, "Failed to fetch collections");
    }
};

exports.getCollection = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return invalidId(res);
        }

        const collection = await Collection.getById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.json(collection);
    } catch (error) {
        return sendError(res, error, "Failed to fetch collection");
    }
};

exports.createCollection = async (req, res) => {
    try {
        const { name, subtitle, image_url } = req.body || {};

        if (!hasText(name)) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if (subtitle !== undefined && subtitle !== null && typeof subtitle !== "string") {
            return res.status(400).json({
                message: "Subtitle must be text"
            });
        }

        const collection = await Collection.create({
            name: name.trim(),
            subtitle: typeof subtitle === "string" ? subtitle : "",
            image_url
        });
        res.status(201).json(collection);
    } catch (error) {
        return sendError(res, error, "Failed to create collection");
    }
};

exports.updateCollection = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return invalidId(res);
        }

        const { name, subtitle, image_url } = req.body || {};

        if (name !== undefined && !hasText(name)) {
            return res.status(400).json({
                message: "Name must not be empty"
            });
        }

        if (subtitle !== undefined && subtitle !== null && typeof subtitle !== "string") {
            return res.status(400).json({
                message: "Subtitle must be text"
            });
        }

        const collection = await Collection.update(req.params.id, {
            name: name === undefined ? undefined : name.trim(),
            subtitle,
            image_url
        });

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.json(collection);
    } catch (error) {
        return sendError(res, error, "Failed to update collection");
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return invalidId(res);
        }

        const collection = await Collection.delete(req.params.id);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.status(204).send();
    } catch (error) {
        return sendError(res, error, "Failed to delete collection");
    }
};

exports.setCollectionProducts = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return invalidId(res);
        }

        const { productIds } = req.body || {};

        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                message: "productIds must be a list"
            });
        }

        if (!productIds.every(isValidId)) {
            return res.status(400).json({
                message: "productIds must only contain valid product ids"
            });
        }

        const found = await Collection.setProducts(req.params.id, productIds);

        if (!found) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        const collection = await Collection.getById(req.params.id);

        res.json(collection);
    } catch (error) {
        return sendError(res, error, "Failed to update collection products");
    }
};
