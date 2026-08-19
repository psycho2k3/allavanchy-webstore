const Product = require("../models/Product");

const isValidId = (id) => {
    return (
        Number.isInteger(Number(id)) &&
        Number(id) > 0
    );
};

const hasText = (value) => {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
};

const isValidNumber = (value) => {
    return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !Number.isNaN(Number(value))
    );
};

const normalizeSizes = (value) => {
    if (value === undefined) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value
            .map((size) =>
                String(size).trim()
            )
            .filter(Boolean);
    }

    if (
        typeof value === "string" &&
        value.trim()
    ) {
        return [value.trim()];
    }

    return [];
};

const normalizeImageUrls = (value) => {
    if (value === undefined) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value
            .filter(
                (url) =>
                    typeof url ===
                        "string" &&
                    url.trim()
            )
            .map((url) =>
                url.trim()
            );
    }

    if (
        typeof value === "string" &&
        value.trim()
    ) {
        return [value.trim()];
    }

    return [];
};

/*
 * CREATE validation.
 */
const validateCreateProduct = (
    product
) => {
    const errors = [];

    if (!hasText(product.name)) {
        errors.push(
            "Name is required"
        );
    }

    if (
        !isValidNumber(
            product.price
        ) ||
        Number(product.price) < 0
    ) {
        errors.push(
            "Price must be a valid non-negative number"
        );
    }

    if (
        !Number.isInteger(
            Number(product.stock)
        ) ||
        Number(product.stock) < 0
    ) {
        errors.push(
            "Stock must be a valid non-negative integer"
        );
    }

    if (
        product.description !==
            undefined &&
        typeof product.description !==
            "string"
    ) {
        errors.push(
            "Description must be text"
        );
    }

    if (
        product.category !==
            undefined &&
        typeof product.category !==
            "string"
    ) {
        errors.push(
            "Category must be text"
        );
    }

    if (
        product.sizes !== undefined &&
        !Array.isArray(
            product.sizes
        )
    ) {
        errors.push(
            "Sizes must be a list"
        );
    }

    if (
        !Array.isArray(
            product.image_urls
        ) ||
        product.image_urls.length === 0
    ) {
        errors.push(
            "At least one product image is required"
        );
    }

    return errors;
};

/*
 * UPDATE validation.
 */
const validateUpdateProduct = (
    product
) => {
    const errors = [];

    if (
        Object.keys(product).length === 0
    ) {
        errors.push(
            "At least one product field is required"
        );
    }

    if (
        product.name !== undefined &&
        !hasText(product.name)
    ) {
        errors.push(
            "Name must not be empty"
        );
    }

    if (
        product.price !== undefined &&
        (
            !isValidNumber(
                product.price
            ) ||
            Number(product.price) < 0
        )
    ) {
        errors.push(
            "Price must be a valid non-negative number"
        );
    }

    if (
        product.stock !== undefined &&
        (
            !Number.isInteger(
                Number(product.stock)
            ) ||
            Number(product.stock) < 0
        )
    ) {
        errors.push(
            "Stock must be a valid non-negative integer"
        );
    }

    if (
        product.description !==
            undefined &&
        typeof product.description !==
            "string"
    ) {
        errors.push(
            "Description must be text"
        );
    }

    if (
        product.category !==
            undefined &&
        typeof product.category !==
            "string"
    ) {
        errors.push(
            "Category must be text"
        );
    }

    if (
        product.sizes !== undefined &&
        !Array.isArray(
            product.sizes
        )
    ) {
        errors.push(
            "Sizes must be a list"
        );
    }

    if (
        product.image_urls !==
            undefined &&
        !Array.isArray(
            product.image_urls
        )
    ) {
        errors.push(
            "Image URLs must be a list"
        );
    }

    return errors;
};

// =====================================================
// GET ALL PRODUCTS
// =====================================================

exports.getProducts = async (
    req,
    res
) => {
    try {
        const products =
            await Product.getAll();

        return res.json(products);

    } catch (error) {
        console.error(
            "Get products error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch products",
            error:
                error.message
        });
    }
};

// =====================================================
// GET PRODUCT
// =====================================================

exports.getProduct = async (
    req,
    res
) => {
    try {
        if (
            !isValidId(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid product id"
            });
        }

        const product =
            await Product.getById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        return res.json(product);

    } catch (error) {
        console.error(
            "Get product error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch product",
            error:
                error.message
        });
    }
};

// =====================================================
// CREATE PRODUCT
// =====================================================

exports.createProduct = async (
    req,
    res
) => {
    try {
        req.body.sizes =
            normalizeSizes(
                req.body.sizes
            );

        req.body.image_urls =
            normalizeImageUrls(
                req.body.image_urls
            );

        /*
         * First Cloudinary image is
         * the primary image.
         */
        if (
            Array.isArray(
                req.body.image_urls
            ) &&
            req.body.image_urls.length > 0
        ) {
            req.body.image_url =
                req.body.image_urls[0];
        }

        const errors =
            validateCreateProduct(
                req.body
            );

        if (errors.length > 0) {
            return res.status(400).json({
                message:
                    "Invalid product input",
                errors
            });
        }

        const product =
            await Product.create(
                req.body
            );

        return res.status(201).json(
            product
        );

    } catch (error) {
        console.error(
            "Create product error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to create product",
            error:
                error.message
        });
    }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

exports.updateProduct = async (
    req,
    res
) => {
    try {
        if (
            !isValidId(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid product id"
            });
        }

        /*
         * Only normalize fields that
         * actually exist in the request.
         */
        if (
            req.body.sizes !==
            undefined
        ) {
            req.body.sizes =
                normalizeSizes(
                    req.body.sizes
                );
        }

        if (
            req.body.image_urls !==
            undefined
        ) {
            req.body.image_urls =
                normalizeImageUrls(
                    req.body.image_urls
                );
        }

        /*
         * If image URLs exist, the first
         * one is the primary image.
         */
        if (
            Array.isArray(
                req.body.image_urls
            ) &&
            req.body.image_urls.length > 0
        ) {
            req.body.image_url =
                req.body.image_urls[0];
        }

        const errors =
            validateUpdateProduct(
                req.body
            );

        if (errors.length > 0) {
            return res.status(400).json({
                message:
                    "Invalid product input",
                errors
            });
        }

        const product =
            await Product.update(
                req.params.id,
                req.body
            );

        if (!product) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        return res.json(product);

    } catch (error) {
        console.error(
            "Update product error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update product",
            error:
                error.message
        });
    }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

exports.deleteProduct = async (
    req,
    res
) => {
    try {
        if (
            !isValidId(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid product id"
            });
        }

        const product =
            await Product.delete(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        return res.json({
            message:
                "Product deleted",
            product
        });

    } catch (error) {
        console.error(
            "Delete product error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete product",
            error:
                error.message
        });
    }
};