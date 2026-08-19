require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("Environment check:");

console.log(
    "CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME
        ? "SET"
        : "MISSING"
);

console.log(
    "CLOUDINARY_API_KEY:",
    process.env.CLOUDINARY_API_KEY
        ? "SET"
        : "MISSING"
);

console.log(
    "CLOUDINARY_API_SECRET:",
    process.env.CLOUDINARY_API_SECRET
        ? "SET"
        : "MISSING"
);

console.log(
    "JWT_SECRET:",
    process.env.JWT_SECRET
        ? "SET"
        : "MISSING"
);

console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL
        ? "SET"
        : "MISSING"
);


app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});