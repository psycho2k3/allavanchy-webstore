const db = require("./src/config/database");

async function testConnection() {
    try {
        const result = await db.query("SELECT NOW()");
        
        console.log("Database connected successfully!");
        console.log(result.rows);

    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);

    } finally {
        db.end();
    }
}

testConnection();