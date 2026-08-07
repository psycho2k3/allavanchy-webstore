const db = require("../config/database");


const Order = {


    async createWithItems({ user_id, items, shipping }) {

        const client = await db.connect();

        try {

            await client.query("BEGIN");

            const total = items.reduce(
                (sum, item) => sum + Number(item.price) * item.quantity,
                0
            );

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