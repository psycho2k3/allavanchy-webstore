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
    },

    async getAll({ page = 1, limit = 20, search, role, status } = {}) {
        const offset = (page - 1) * limit;
        const values = [];
        const filters = [];

        if (search) {
            values.push(`%${search}%`);
            filters.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
        }

        if (role) {
            values.push(role);
            filters.push(`role = $${values.length}`);
        }

        if (status) {
            values.push(status);
            filters.push(`status = $${values.length}`);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
        values.push(limit, offset);

        const users = await db.query(
            `
            SELECT id, name, email, role, status, created_at
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
            data: users.rows,
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
            SELECT id, name, email, role, status, created_at
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0];
    },

    async updateRole(id, role) {
        const result = await db.query(
            `
            UPDATE users
            SET role = $1
            WHERE id = $2
            RETURNING id, name, email, role, status, created_at
            `,
            [role, id]
        );

        return result.rows[0];
    },

    async updateStatus(id, status) {
        const result = await db.query(
            `
            UPDATE users
            SET status = $1
            WHERE id = $2
            RETURNING id, name, email, role, status, created_at
            `,
            [status, id]
        );

        return result.rows[0];
    }
};

module.exports = AdminUser;