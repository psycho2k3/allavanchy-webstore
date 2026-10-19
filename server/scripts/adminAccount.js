const bcrypt = require("bcrypt");

const ADMIN_NAME = "Tshepo Ndlovu";
const ADMIN_EMAIL = "designerndlovu0713@gmail.com";

/**
 * Read --password <value> from the command line. The password is never stored
 * in the repository; pass it when running the script.
 */
const getPasswordArg = () => {
    const index = process.argv.indexOf("--password");
    const password = index !== -1 ? process.argv[index + 1] : undefined;

    if (!password) {
        console.error('Missing password. Usage: npm run <script> -- --password "<password>"');
        process.exit(1);
    }

    return password;
};

/**
 * Create the store admin, or reset an existing account with that email to an
 * active admin with the given password.
 */
const upsertAdmin = async (client, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
        `
        INSERT INTO users (name, email, password, role, status)
        VALUES ($1, $2, $3, 'admin', 'active')
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name,
            password = EXCLUDED.password,
            role = 'admin',
            status = 'active'
        RETURNING id, name, email, role
        `,
        [ADMIN_NAME, ADMIN_EMAIL, hashedPassword]
    );

    return result.rows[0];
};

module.exports = {
    ADMIN_EMAIL,
    getPasswordArg,
    upsertAdmin
};
