const Product = require("../models/Product");
const { isValidId, sendError } = require("../utils/http");

const MAX_PRICE = 9999999999.99;
const MAX_STOCK = 2147483647;

const hasText = (value) => {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
};

/*
 * Multipart list fields (sizes, image_urls) can arrive as:
 *
 * - a JSON array string:   '["S","M"]'  or  '[]'
 * - a plain single string: 'S'
 * - repeated fields:       ['S', 'M']
 *
 * Returns undefined when the field is absent, null when it is malformed,
 * otherwise a de-duplicated list of trimmed, non-empty strings.
 */
const parseListField = (value) => {
    if (value === undefined) {
        return undefined;
    }

    let list = value;

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (trimmed.startsWith("[")) {
            try {
                list = JSON.parse(trimmed);
            } catch (error) {
                return null;
            }
        } else {
            list = trimmed ? [trimmed] : [];
        }
    }

    if (!Array.isArray(list)) {
        return null;
    }

    const items = [];

    for (const item of list) {
        if (
            typeof item !== "string" &&
            typeof item !== "number"
        ) {
            return null;
        }

        const text = String(item).trim();

        if (text && !items.includes(text)) {
            items.push(text);
        }
    }

    return items;
};

const parsePrice = (value) => {
    let text;

    if (typeof value === "number") {
        text = String(value);
    } else if (typeof value === "string") {
        text = value.trim();
    } else {
        return null;
    }

    if (!/^\d+(\.\d+)?$/.test(text)) {
        return null;
    }

    // NUMERIC(12, 2) rounds to cents, so check the rounded value.
    const price = Math.round(Number(text) * 100) / 100;

    if (
        !Number.isFinite(price) ||
        price < 0 ||
        price > MAX_PRICE
    ) {
        return null;
    }

    return price;
};

const parseStock = (value) => {
    const text = String(
        value === undefined || value === null ? "" : value
    ).trim();

    if (!/^\d+$/.test(text)) {
        return null;
    }

    const stock = Number.parseInt(text, 10);

    return stock <= MAX_STOCK ? stock : null;
};

const isValidImageUrl = (url) => /^https?:\/\//i.test(url);

/*
 * Validate the request body and build the exact object passed to the
 * model. Only whitelisted fields are copied so a client cannot set
 * image_url or other columns directly.
 */
const buildProductInput = (body, { isCreate }) => {
    const errors = [];
    const product = {};

    if (isCreate || body.name !== undefined) {
        if (!hasText(body.name)) {
            errors.push(
                isCreate
                    ? "Name is required"
                    : "Name must not be empty"
            );
        } else if (body.name.trim().length > 255) {
            errors.push(
                "Name must be 255 characters or fewer"
            );
        } else {
            product.name = body.name.trim();
        }
    }

    if (isCreate || body.price !== undefined) {
        const price = parsePrice(body.price);

        if (price === null) {
            errors.push(
                "Price must be a valid non-negative number"
            );
        } else {
            product.price = price;
        }
    }

    if (isCreate || body.stock !== undefined) {
        const stock = parseStock(body.stock);

        if (stock === null) {
            errors.push(
                "Stock must be a valid non-negative integer"
            );
        } else {
            product.stock = stock;
        }
    }

    if (body.description !== undefined) {
        if (typeof body.description !== "string") {
            errors.push(
                "Description must be text"
            );
        } else {
            product.description = body.description;
        }
    }

    if (body.category !== undefined) {
        if (typeof body.category !== "string") {
            errors.push(
                "Category must be text"
            );
        } else if (body.category.trim().length > 100) {
            errors.push(
                "Category must be 100 characters or fewer"
            );
        } else {
            product.category = body.category.trim();
        }
    }

    const sizes = parseListField(body.sizes);

    if (sizes === null) {
        errors.push(
            "Sizes must be a list"
        );
    } else if (sizes !== undefined) {
        product.sizes = sizes;
    } else if (isCreate) {
        product.sizes = [];
    }

    return { errors, product };
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
        return sendError(
            res,
            error,
            "Failed to fetch products"
        );
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
        return sendError(
            res,
            error,
            "Failed to fetch product"
        );
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
        req.body = req.body || {};

        const { errors, product } =
            buildProductInput(
                req.body,
                { isCreate: true }
            );

        /*
         * The newly uploaded Cloudinary
         * images are the product images.
         * The first one is the primary image.
         */
        const imageUrls =
            req.uploadedImageUrls || [];

        if (imageUrls.length === 0) {
            errors.push(
                "At least one product image is required"
            );
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message:
                    errors[0],
                errors
            });
        }

        product.image_urls = imageUrls;
        product.image_url = imageUrls[0];

        const created =
            await Product.create(
                product
            );

        return res.status(201).json(
            created
        );

    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to create product"
        );
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
        req.body = req.body || {};

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

        const existing =
            await Product.getById(
                req.params.id
            );

        if (!existing) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        const { errors, product } =
            buildProductInput(
                req.body,
                { isCreate: false }
            );

        /*
         * Final image list = kept image_urls + newly uploaded images.
         *
         * When image_urls is not sent at all, the existing images are
         * kept and any new uploads are appended to them.
         */
        const uploadedUrls =
            req.uploadedImageUrls || [];

        let keptUrls =
            parseListField(
                req.body.image_urls
            );

        if (keptUrls === null) {
            errors.push(
                "Image URLs must be a list"
            );
        } else if (
            keptUrls !== undefined &&
            !keptUrls.every(isValidImageUrl)
        ) {
            errors.push(
                "Image URLs must be valid links"
            );
        }

        if (
            keptUrls === undefined &&
            uploadedUrls.length > 0
        ) {
            keptUrls =
                Array.isArray(existing.image_urls) &&
                existing.image_urls.length > 0
                    ? existing.image_urls
                    : [existing.image_url].filter(Boolean);
        }

        if (
            Array.isArray(keptUrls) &&
            errors.length === 0
        ) {
            const imageUrls = [
                ...keptUrls,
                ...uploadedUrls.filter(
                    (url) => !keptUrls.includes(url)
                )
            ];

            if (imageUrls.length === 0) {
                return res.status(400).json({
                    message:
                        "A product must have at least one image"
                });
            }

            product.image_urls = imageUrls;
            product.image_url = imageUrls[0];
        }

        if (
            errors.length === 0 &&
            Object.keys(product).length === 0
        ) {
            errors.push(
                "At least one product field is required"
            );
        }

        if (errors.length > 0) {
            return res.status(400).json({
                message:
                    errors[0],
                errors
            });
        }

        const updated =
            await Product.update(
                req.params.id,
                product
            );

        if (!updated) {
            return res.status(404).json({
                message:
                    "Product not found"
            });
        }

        return res.json(updated);

    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to update product"
        );
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
        // Only possible if migration 002 (ON DELETE SET NULL) has not run.
        return sendError(
            res,
            error,
            "Failed to delete product",
            {
                "23503":
                    "Product is referenced by orders"
            }
        );
    }
};
