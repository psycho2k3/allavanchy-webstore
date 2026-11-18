require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../src/config/database");

const ADMIN_NAME = "Tshepho Ndlovu";
const ADMIN_EMAIL = "designerndlovu0713@gmail.com";

(async () => {
    const passwordIndex = process.argv.indexOf("--password");
    const password =
        passwordIndex !== -1 ? process.argv[passwordIndex + 1] : undefined;

    if (!password) {
        console.error('Usage: node scripts/create-second-admin.js --password "YOUR_PASSWORD"');
        process.exitCode = 1;
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (name, email, password, role, status)
             VALUES ($1, $2, $3, 'admin', 'active')
             ON CONFLICT (email) DO NOTHING
             RETURNING id, name, email, role, status`,
            [ADMIN_NAME, ADMIN_EMAIL, hashedPassword]
        );

        if (result.rowCount === 0) {
            console.log("That email already exists. No account or password was changed.");
        } else {
            console.log("Second admin created:", result.rows[0]);
        }
    } catch (error) {
        console.error("Failed to create second admin:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
})();
