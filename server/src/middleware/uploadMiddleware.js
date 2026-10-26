const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

// Vercel Functions accept a maximum 4.5 MB request body. Anything bigger is
// cut off by the platform with a non-JSON error, so reject it ourselves first.
const MAX_UPLOAD_BYTES = 4.4 * 1024 * 1024;

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
        // Leave room for multipart metadata and reject oversized single-file
        // uploads.
        fileSize: 4 * 1024 * 1024,
        files: 10
    }
});

/**
 * Reject oversized requests before multer buffers them.
 */
const rejectOversizedUpload = (req, res, next) => {
    const contentLength = Number(req.headers["content-length"]);

    if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_UPLOAD_BYTES
    ) {
        return res.status(413).json({
            message:
                "Upload too large. Total images must be under 4 MB."
        });
    }

    next();
};

/**
 * Upload a multer file to Cloudinary.
 */
const uploadFileToCloudinary = (
    file,
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

        const options = {
            folder,
            resource_type: "image"
        };

        /*
         * iPhone photos arrive as HEIC/HEIF, which most browsers cannot
         * display. Ask Cloudinary to store them as JPG.
         */
        if (
            file.mimetype === "image/heic" ||
            file.mimetype === "image/heif"
        ) {
            options.format = "jpg";
        }

        const stream =
            cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        stream.end(file.buffer);
    });
};

/**
 * Cloudinary error messages contain no secrets, so they are returned to the
 * admin in every environment to make upload problems diagnosable.
 */
const sendUploadError = (res, error) => {
    return res.status(502).json({
        message:
            `Failed to upload images: ${
                (error && error.message) || "Unknown error"
            }`
    });
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
 *
 * The uploaded URLs are exposed as req.uploadedImageUrls. The product
 * controller combines them with the kept image_urls.
 */
const processProductImages = async (
    req,
    res,
    next
) => {
    req.body = req.body || {};
    req.uploadedImageUrls = [];

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

        if (files.length === 0) {
            return next();
        }

        /*
         * Upload every supplied image
         * to Cloudinary.
         */
        const results = await Promise.all(
            files.map((file) =>
                uploadFileToCloudinary(
                    file,
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
         * Cloudinary should return a URL
         * for every uploaded image.
         */
        if (uploadedUrls.length !== files.length) {
            return res.status(502).json({
                message:
                    "Failed to upload images: Cloudinary did not return a URL for every image"
            });
        }

        req.uploadedImageUrls = uploadedUrls;

        return next();

    } catch (error) {
        console.error(
            "Product image upload error:",
            error
        );

        return sendUploadError(res, error);
    }
};

/**
 * Upload a single site or collection image and expose its URL to the
 * controller in the same way as product uploads.
 */
const processSiteImage = async (req, res, next) => {
    req.body = req.body || {};

    try {
        if (!req.file) {
            return next();
        }

        const result = await uploadFileToCloudinary(
            req.file,
            "allavanchy/site"
        );

        if (!result || !result.secure_url) {
            return res.status(502).json({
                message:
                    "Failed to upload images: Cloudinary did not return a URL"
            });
        }

        req.body.image_url = result.secure_url;
        return next();
    } catch (error) {
        console.error("Site image upload error:", error);

        return sendUploadError(res, error);
    }
};

/**
 * Product image middleware.
 *
 * IMPORTANT:
 * The field name is "images".
 */
const uploadProductImages = [
    rejectOversizedUpload,
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
                    "Each image must be 4MB or smaller"
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
            rejectOversizedUpload,
            upload.single("image"),
            processSiteImage
        ],

    handleUploadError
};
