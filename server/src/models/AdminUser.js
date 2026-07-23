const db = require("../config/database");

const AdminUser = {
    async getCustomers({ page = 1, limit = 20, search } = {}) {
        const offset = (page - 1) * limit;
        const values = [];
        const filters = ["role = 'customer'"];

        if (search) {
            values.push(`%${search}%`);
            filters.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
        }

        const whereClause = `WHERE ${filters.join(" AND ")}`;
        values.push(limit, offset);

        const customers = await db.query(
            `
            SELECT id, name, email, role, created_at
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${values.length - 1} OFFSET $${values.length}
            `,
            values
        );

        const total = await db.query(
            `SELECT COUNT(*)::int AS count FROM users ${whereClause}`,
            values.slice(0, -2)
        );

        return {
            data: customers.rows,
            pagination: {
                page,
                limit,
                total: total.rows[0].count,
                pages: Math.ceil(total.rows[0].count / limit)
            }
        };
    }
};

module.exports = AdminUser;
