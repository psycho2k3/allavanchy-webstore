const db = require("../config/database");
const { calculateTotals } = require("../config/checkout");


const Order = {


    async createWithItems({ user_id, items, shipping }) {

        const client = await db.connect();

        try {

            await client.query("BEGIN");

            const { total } = calculateTotals(items);

            const orderResult = await client.query(
                `
                INSERT INTO orders
                (user_id, total, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_phone)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
                `,
                [
                    user_id,
                    total,
                    shipping.name,
                    shipping.address,
                    shipping.city,
                    shipping.postal_code,
                    shipping.phone
                ]
            );

            const order = orderResult.rows[0];

            for (const item of items) {

                await client.query(
                    `
                    INSERT INTO order_items
                    (order_id, product_id, product_name, quantity, price)
                    VALUES ($1, $2, $3, $4, $5)
                    `,
                    [
                        order.id,
                        item.product_id,
                        item.product_name,
                        item.quantity,
                        item.price
                    ]
                );

                const stockResult = await client.query(
                    `
                    UPDATE products
                    SET stock = stock - $1
                    WHERE id = $2 AND stock >= $1
                    RETURNING id
                    `,
                    [item.quantity, item.product_id]
                );

                if (stockResult.rows.length === 0) {
                    throw new Error(`Insufficient stock for ${item.product_name}`);
                }

            }

            await client.query("COMMIT");

            return order;

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }

    },


    async getUserOrders(user_id){

        const result = await db.query(
            `
            SELECT *
            FROM orders
            WHERE user_id=$1
            ORDER BY created_at DESC
            `,
            [
                user_id
            ]
        );


        return result.rows;

    },


    async getById(id) {

        const orderResult = await db.query(
            `
            SELECT *
            FROM orders
            WHERE id = $1
            `,
            [id]
        );

        const order = orderResult.rows[0];

        if (!order) return null;

        const itemsResult = await db.query(
            `
            SELECT id, order_id, product_id, product_name, quantity, price
            FROM order_items
            WHERE order_id = $1
            ORDER BY id ASC
            `,
            [id]
        );

        return {
            ...order,
            items: itemsResult.rows
        };

    },


    async findByPaymentReference(reference) {

        const result = await db.query(
            `
            SELECT *
            FROM orders
            WHERE payment_reference = $1
            `,
            [reference]
        );

        return result.rows[0] || null;

    },


    async setPaymentReference(id, reference) {

        const result = await db.query(
            `
            UPDATE orders
            SET payment_reference = $1, updated_at = NOW()
            WHERE id = $2 AND payment_status <> 'paid'
            RETURNING *
            `,
            [reference, id]
        );

        return result.rows[0];

    },


    // Idempotent: safe to call from both the verify endpoint and the webhook.
    async markPaid(id, reference) {

        const result = await db.query(
            `
            UPDATE orders
            SET
                payment_status = 'paid',
                paid_at = COALESCE(paid_at, NOW()),
                status = CASE WHEN status = 'Pending' THEN 'Processing' ELSE status END,
                updated_at = NOW()
            WHERE id = $1 AND payment_reference = $2
            RETURNING *
            `,
            [id, reference]
        );

        return result.rows[0];

    },


    async updateStatus(id, status) {

        const result = await db.query(
            `
            UPDATE orders
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        return result.rows[0];

    }


};


module.exports = Order;