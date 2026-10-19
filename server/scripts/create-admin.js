// Creates (or resets) the store admin account without touching other data.
// Usage: npm run create-admin -- --password "<password>"
require("dotenv").config();

const db = require("../src/config/database");
const { getPasswordArg, upsertAdmin } = require("./adminAccount");

(async () => {
    const password = getPasswordArg();

    try {
        const admin = await upsertAdmin(db, password);
        console.log(`Admin ready: ${admin.name} <${admin.email}>`);
    } catch (error) {
        console.error("Failed to create admin:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
})();
