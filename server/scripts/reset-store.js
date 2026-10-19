// Wipes ALL store data (products, collections, categories, orders, and every
// user account) and leaves a single admin account. Site settings are kept.
// Images already uploaded to Cloudinary are not deleted.
//
// Usage: npm run reset-store -- --confirm --password "<admin password>"
require("dotenv").config();

const db = require("../src/config/database");
const { ADMIN_EMAIL, getPasswordArg, upsertAdmin } = require("./adminAccount");

(async () => {
    if (!process.argv.includes("--confirm")) {
        console.error(
            "This permanently deletes all products, collections, orders and users.\n" +
            'Re-run with --confirm to proceed: npm run reset-store -- --confirm --password "<password>"'
        );
        process.exit(1);
    }

    const password = getPasswordArg();
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        await client.query(`
            TRUNCATE
                order_items,
                orders,
                collection_products,
                collections,
                products,
                categories,
                users
            RESTART IDENTITY CASCADE
        `);

        const admin = await upsertAdmin(client, password);

        await client.query("COMMIT");

        console.log("Store data cleared.");
        console.log(`Only account remaining: ${admin.name} <${ADMIN_EMAIL}> (admin)`);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Reset failed, nothing was changed:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await db.end();
    }
})();
