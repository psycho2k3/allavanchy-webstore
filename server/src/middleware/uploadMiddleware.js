const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (
        !file.mimetype ||
        !file.mimetype.startsWith("image/")
    ) {
        return cb(
            new Error("Only image files are allowed"),
            false
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
});

/**
 * Upload a file buffer to Cloudinary.
 */
const uploadBufferToCloudinary = (
    fileBuffer,
    folder
) => {
    return new Promise((resolve, reject) => {
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return reject(
                new Error(
                    "Cloudinary is not configured"
                )
            );
        }

        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        stream.end(fileBuffer);
    });
};

/**
 * Normalize existing image URLs.
 *
 * Used when updating an existing product.
 */
const normalizeExistingImageUrls = (value) => {
    if (value === undefined) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.filter(
            (url) =>
                typeof url === "string" &&
                url.trim().length > 0
        );
    }

    if (
        typeof value === "string" &&
        value.trim().length > 0
    ) {
        return [value.trim()];
    }

    return [];
};

/**
 * Process product images.
 *
 * IMPORTANT:
 *
 * Product image uploads MUST use:
 *
 * formData.append("images", file)
 *
 * because Multer expects:
 *
 * upload.array("images", 10)
 */
const processProductImages = async (
    req,
    res,
    next
) => {
    try {
        const files = req.files || [];

        /*
         * CREATE
         *
         * A product must have at least
         * one image.
         */
        if (
            req.method === "POST" &&
            files.length === 0
        ) {
            return res.status(400).json({
                message:
                    "At least one product image is required"
            });
        }

        /*
         * UPDATE
         *
         * No new image was supplied.
         * Leave existing image fields untouched.
         */
        if (
            req.method !== "POST" &&
            files.length === 0
        ) {
            return next();
        }

        /*
         * Upload every supplied image
         * to Cloudinary.
         */
        const results = await Promise.all(
            files.map((file) =>
                uploadBufferToCloudinary(
                    file.buffer,
                    "allavanchy/products"
                )
            )
        );

        const uploadedUrls = results
            .filter(
                (result) =>
                    result &&
                    result.secure_url
            )
            .map(
                (result) =>
                    result.secure_url
            );

        /*
         * Cloudinary should return at least
         * one URL for every uploaded image.
         */
        if (uploadedUrls.length === 0) {
            return res.status(502).json({
                message:
                    "Product image upload did not return any URLs"
            });
        }

        /*
         * CREATE
         *
         * The newly uploaded images become
         * the product image list.
         */
        if (req.method === "POST") {
            req.body.image_urls =
                uploadedUrls;

            req.body.image_url =
                uploadedUrls[0];

            return next();
        }

        /*
         * UPDATE
         *
         * Preserve existing images and
         * append newly uploaded images.
         */
        const existingUrls =
            normalizeExistingImageUrls(
                req.body.image_urls
            );

        const combinedUrls = [
            ...existingUrls,
            ...uploadedUrls
        ];

        req.body.image_urls =
            combinedUrls;

        /*
         * Keep the first image as the
         * primary image.
         */
        if (combinedUrls.length > 0) {
            req.body.image_url =
                combinedUrls[0];
        }

        return next();

    } catch (error) {
        console.error(
            "Product image upload error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to upload product images",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message
        });
    }
};

/**
 * Upload a single site or collection image and expose its URL to the
 * controller in the same way as product uploads.
 */
const processSiteImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const result = await uploadBufferToCloudinary(
            req.file.buffer,
            "allavanchy/site"
        );

        if (!result || !result.secure_url) {
            return res.status(502).json({
                message: "Image upload did not return a URL"
            });
        }

        req.body.image_url = result.secure_url;
        return next();
    } catch (error) {
        console.error("Site image upload error:", error);

        return res.status(500).json({
            message: "Failed to upload image",
            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message
        });
    }
};

/**
 * Product image middleware.
 *
 * IMPORTANT:
 * The field name is "images".
 */
const uploadProductImages = [
    upload.array("images", 10),
    processProductImages
];

/**
 * Multer error handler.
 */
const handleUploadError = (
    error,
    req,
    res,
    next
) => {
    if (!error) {
        return next();
    }

    if (
        error instanceof multer.MulterError
    ) {
        if (
            error.code ===
            "LIMIT_FILE_SIZE"
        ) {
            return res.status(400).json({
                message:
                    "Each image must be 5MB or smaller"
            });
        }

        if (
            error.code ===
            "LIMIT_FILE_COUNT"
        ) {
            return res.status(400).json({
                message:
                    "You can upload a maximum of 10 images"
            });
        }

        if (
            error.code ===
            "LIMIT_UNEXPECTED_FILE"
        ) {
            return res.status(400).json({
                message:
                    'Unexpected image field. Use the "images" field.'
            });
        }

        return res.status(400).json({
            message:
                error.message ||
                "Invalid upload"
        });
    }

    return res.status(400).json({
        message:
            error.message ||
            "Invalid image"
    });
};

module.exports = {
    uploadProductImages,

    uploadSiteImage:
        [
            upload.single("image"),
            processSiteImage
        ],

    handleUploadError
};
