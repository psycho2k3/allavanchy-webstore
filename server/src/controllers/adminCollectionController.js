const Collection = require("../models/Collection");

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.getAll();
        res.json(collections);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getCollection = async (req, res) => {
    try {
        const collection = await Collection.getById(req.params.id);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.createCollection = async (req, res) => {
    try {
        const { name, subtitle, image_url } = req.body;

        if (!hasText(name)) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const collection = await Collection.create({ name, subtitle, image_url });
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateCollection = async (req, res) => {
    try {
        const { name, subtitle, image_url } = req.body;

        if (name !== undefined && !hasText(name)) {
            return res.status(400).json({
                message: "Name must not be empty"
            });
        }

        const collection = await Collection.update(req.params.id, { name, subtitle, image_url });

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.delete(req.params.id);

        if (!collection) {
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.setCollectionProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                message: "productIds must be a list"
            });
        }

        await Collection.setProducts(req.params.id, productIds);

        const collection = await Collection.getById(req.params.id);

        res.json(collection);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};