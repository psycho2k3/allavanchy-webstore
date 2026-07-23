const AdminProduct = require("../models/AdminProduct");

const toPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

exports.getProducts = async (req, res) => {
    try {
        const products = await AdminProduct.getAll({
            page: toPositiveInteger(req.query.page, 1),
            limit: toPositiveInteger(req.query.limit, 20),
            search: req.query.search
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await AdminProduct.getById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await AdminProduct.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await AdminProduct.update(req.params.id, req.body);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await AdminProduct.delete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
