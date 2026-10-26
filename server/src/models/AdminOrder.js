const db = require("../config/database");

const AdminOrder = {
    async getAll({ page = 1, limit = 20, search, status } = {}) {
        const offset = (page - 1) * limit;
        const values = [];
        const filters = [];

        if (search) {
            values.push(`%${search}%`);
            filters.push(`(u.email ILIKE $${values.length} OR u.name ILIKE $${values.length})`);
        }

        if (status) {
            values.push(status);
            filters.push(`o.status = $${values.length}`);
        }

        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
        values.push(limit, offset);

        const orders = await db.query(
            `
            SELECT
                o.id,
                o.user_id,
                o.total,
                o.status,
                o.payment_status,
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

        const order = result.rows[0];

        if (!order) return null;

        const items = await db.query(
            `
            SELECT id, product_id, product_name, size, quantity, price
            FROM order_items
            WHERE order_id = $1
            ORDER BY id ASC
            `,
            [id]
        );

        return {
            ...order,
            items: items.rows
        };
    },

    /*
     * Cancelling an order releases its stock; re-opening a cancelled order
     * reserves it again. Both happen in the same transaction as the status
     * change. Items whose product was deleted (product_id NULL) are skipped.
     */
    async updateStatus(id, status) {
        const client = await db.connect();

        try {
            await client.query("BEGIN");

            const current = await client.query(
                `
                SELECT id, status
                FROM orders
                WHERE id = $1
                FOR UPDATE
                `,
                [id]
            );

            if (!current.rows[0]) {
                await client.query("ROLLBACK");
                return null;
            }

            const wasCancelled = current.rows[0].status === "Cancelled";
            const isCancelled = status === "Cancelled";

            if (!wasCancelled && isCancelled) {
                await client.query(
                    `
                    UPDATE products p
                    SET stock = p.stock + oi.quantity, updated_at = NOW()
                    FROM (
                        SELECT product_id, SUM(quantity)::int AS quantity
                        FROM order_items
                        WHERE order_id = $1 AND product_id IS NOT NULL
                        GROUP BY product_id
                    ) oi
                    WHERE p.id = oi.product_id
                    `,
                    [id]
                );
            }

            if (wasCancelled && !isCancelled) {
                const items = await client.query(
                    `
                    SELECT product_id, MIN(product_name) AS product_name, SUM(quantity)::int AS quantity
                    FROM order_items
                    WHERE order_id = $1 AND product_id IS NOT NULL
                    GROUP BY product_id
                    ORDER BY product_id ASC
                    `,
                    [id]
                );

                for (const item of items.rows) {
                    const reserved = await client.query(
                        `
                        UPDATE products
                        SET stock = stock - $1, updated_at = NOW()
                        WHERE id = $2 AND stock >= $1
                        RETURNING id
                        `,
                        [item.quantity, item.product_id]
                    );

                    if (reserved.rows.length === 0) {
                        const error = new Error(
                            `${item.product_name} does not have enough stock`
                        );
                        error.status = 409;
                        throw error;
                    }
                }
            }

            const result = await client.query(
                `
                UPDATE orders
                SET status = $1, updated_at = NOW()
                WHERE id = $2
                RETURNING *
                `,
                [status, id]
            );

            await client.query("COMMIT");

            return result.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
};

module.exports = AdminOrder;