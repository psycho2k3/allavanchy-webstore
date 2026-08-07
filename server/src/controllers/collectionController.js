const Collection = require("../models/Collection");

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.getAll();

        const withProducts = await Promise.all(
            collections.map((collection) => Collection.getById(collection.id))
        );

        res.json(withProducts);
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