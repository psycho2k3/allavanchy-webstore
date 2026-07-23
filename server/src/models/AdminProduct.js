const db = require("../config/database");

const AdminProduct = {
    async getAll({ page = 1, limit = 20, search } = {}) {
        const offset = (page - 1) * limit;
        const values = [];
        const filters = [];

        if (search) {
            values.push(`%${search}%`);
            filters.push(`name ILIKE $${values.length}`);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
        values.push(limit, offset);

        const products = await db.query(
            `
            SELECT id, name, description, price, image_url, stock, created_at
            FROM products
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${values.length - 1} OFFSET $${values.length}
            `,
            values
        );

        const total = await db.query(
            `SELECT COUNT(*)::int AS count FROM products ${whereClause}`,
            values.slice(0, -2)
        );

        return {
            data: products.rows,
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
            SELECT id, name, description, price, image_url, stock, created_at
            FROM products
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0];
    },

    async create(product) {
        const { name, description, price, image_url, stock } = product;

        const result = await db.query(
            `
            INSERT INTO products (name, description, price, image_url, stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [name, description, price, image_url, stock]
        );

        return result.rows[0];
    },

    async update(id, product) {
        const { name, description, price, image_url, stock } = product;

        const result = await db.query(
            `
            UPDATE products
            SET
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                price = COALESCE($4, price),
                image_url = COALESCE($5, image_url),
                stock = COALESCE($6, stock)
            WHERE id = $1
            RETURNING *
            `,
            [id, name, description, price, image_url, stock]
        );

        return result.rows[0];
    },

    async delete(id) {
        const result = await db.query(
            `
            DELETE FROM products
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        return result.rows[0];
    }
};

module.exports = AdminProduct;
