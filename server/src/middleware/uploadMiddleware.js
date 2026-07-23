const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "allavanchy/products",
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

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const result = await uploadToCloudinary(req.file.buffer);
        req.body.image_url = result.secure_url;

        next();
    } catch (error) {
        res.status(500).json({
            message: "Failed to upload product image",
            error: error.message
        });
    }
};

const handleUploadError = (error, req, res, next) => {
    if (!error) {
        return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "Product image must be 5MB or smaller"
        });
    }

    return res.status(400).json({
        message: error.message || "Invalid product image"
    });
};

module.exports = {
    uploadSingleProductImage: upload.single("image"),
    uploadProductImage,
    handleUploadError
};
