const db = require("../config/database");


const Order = {


    async create(user_id, total, items = []) {

        const client = await db.connect();

        try {

            await client.query("BEGIN");

            const orderResult = await client.query(
                `
                INSERT INTO orders
                (user_id, total)
                VALUES ($1, $2)
                RETURNING *
                `,
                [user_id, total]
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