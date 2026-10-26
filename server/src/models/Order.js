const db = require("../config/database");
const { calculateTotals } = require("../config/checkout");

// product_id is NULL when the product has since been deleted; product_name
// and price are snapshots, so the item still displays correctly.
const orderItemColumns = `
    id,
    order_id,
    product_id,
    product_name,
    size,
    quantity,
    price
`;


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

            // Reserve stock once per product (all sizes combined). Lock rows
            // in id order so concurrent checkouts cannot deadlock.
            const quantities = new Map();

            for (const item of items) {
                const current = quantities.get(String(item.product_id));

                quantities.set(String(item.product_id), {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: (current ? current.quantity : 0) + item.quantity
                });
            }

            const reservations = [...quantities.values()].sort(
                (a, b) => Number(a.product_id) - Number(b.product_id)
            );

            for (const reservation of reservations) {

                const stockResult = await client.query(
                    `
                    UPDATE products
                    SET stock = stock - $1
                    WHERE id = $2 AND stock >= $1
                    RETURNING id
                    `,
                    [reservation.quantity, reservation.product_id]
                );

                if (stockResult.rows.length === 0) {
                    const error = new Error(
                        `${reservation.product_name} does not have enough stock`
                    );
                    error.status = 409;
                    throw error;
                }

            }

            const orderItems = [];

            for (const item of items) {

                const itemResult = await client.query(
                    `
                    INSERT INTO order_items
                    (order_id, product_id, product_name, size, quantity, price)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING ${orderItemColumns}
                    `,
                    [
                        order.id,
                        item.product_id,
                        item.product_name,
                        item.size || null,
                        item.quantity,
                        item.price
                    ]
                );

                orderItems.push(itemResult.rows[0]);

            }

            await client.query("COMMIT");

            return {
                ...order,
                items: orderItems
            };

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

        const orders = result.rows;

        if (orders.length === 0) {
            return orders;
        }

        const itemsResult = await db.query(
            `
            SELECT ${orderItemColumns}
            FROM order_items
            WHERE order_id = ANY($1::bigint[])
            ORDER BY id ASC
            `,
            [orders.map((order) => order.id)]
        );

        return orders.map((order) => ({
            ...order,
            items: itemsResult.rows.filter(
                (item) => String(item.order_id) === String(order.id)
            )
        }));

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
            SELECT ${orderItemColumns}
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
    // The reference that was actually paid is stored, because a later
    // initialize call may have replaced payment_reference with a new one.
    // Cancelled orders are never marked paid (their stock has been released).
    async markPaid(id, reference) {

        const result = await db.query(
            `
            UPDATE orders
            SET
                payment_status = 'paid',
                payment_reference = $2,
                paid_at = COALESCE(paid_at, NOW()),
                status = CASE WHEN status = 'Pending' THEN 'Processing' ELSE status END,
                updated_at = NOW()
            WHERE id = $1
                AND payment_status <> 'paid'
                AND status <> 'Cancelled'
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
