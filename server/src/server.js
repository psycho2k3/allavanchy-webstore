require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const requiredEnv = [
    "DATABASE_URL",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
    console.warn(`Missing environment variables: ${missingEnv.join(", ")}`);
}

// On Vercel the exported app is invoked as a serverless function, so only
// open a port when running locally (npm start / npm run dev).
if (!process.env.VERCEL && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
