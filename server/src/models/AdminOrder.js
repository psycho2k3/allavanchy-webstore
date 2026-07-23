const db = require("../config/database");

const AdminOrder = {
    async getAll({ page = 1, limit = 20, search } = {}) {
        const offset = (page - 1) * limit;
        const values = [];
        const filters = [];

        if (search) {
            values.push(`%${search}%`);
            filters.push(`(u.email ILIKE $${values.length} OR u.name ILIKE $${values.length})`);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
        values.push(limit, offset);

        const orders = await db.query(
            `
            SELECT
                o.id,
                o.user_id,
                o.total,
                o.created_at,
                u.name AS customer_name,
                u.email AS customer_email
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            ${whereClause}
            ORDER BY o.created_at DESC
            LIMIT $${values.length - 1} OFFSET $${values.length}
            `,
            values
        );

        const total = await db.query(
            `
            SELECT COUNT(*)::int AS count
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            ${whereClause}
            `,
            values.slice(0, -2)
        );

        return {
            data: orders.rows,
            pagination: {
                page,
                limit,
                total: total.rows[0].count,
                pages: Math.ceil(total.rows[0].count / limit)
            }
        };
    },

    async getById(id) {
        const result = await db.query(
            `
            SELECT
                o.*,
                u.name AS customer_name,
                u.email AS customer_email
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            WHERE o.id = $1
            `,
            [id]
        );

        return result.rows[0];
    }
};

module.exports = AdminOrder;
