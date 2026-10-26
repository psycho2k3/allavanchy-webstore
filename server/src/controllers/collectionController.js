const Collection = require("../models/Collection");
const { isValidId, sendError } = require("../utils/http");

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.getAll();

        const withProducts = await Promise.all(
            collections.map((collection) => Collection.getById(collection.id))
        );

        // A collection deleted between the two queries comes back as null.
        res.json(withProducts.filter(Boolean));
    } catch (error) {
        return sendError(res, error, "Failed to fetch collections");
    }
};

exports.getCollection = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid collection id"
            });
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
