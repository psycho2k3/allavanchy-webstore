const db = require("../config/database");

const AdminDashboard = {
    async getMetrics() {
        const [
            sales,
            orders,
            customers,
            products,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            db.query(`
                SELECT COALESCE(SUM(total), 0)::numeric AS total_revenue
                FROM orders
            `),
            db.query(`
                SELECT COUNT(*)::int AS total_orders
                FROM orders
            `),
            db.query(`
                SELECT COUNT(*)::int AS total_customers
                FROM users
                WHERE role = 'customer'
            `),
            db.query(`
                SELECT
                    COUNT(*)::int AS total_products,
                    COUNT(*) FILTER (WHERE stock <= 5)::int AS low_stock_count
                FROM products
            `),
            db.query(`
                SELECT id, user_id, total, created_at
                FROM orders
                ORDER BY created_at DESC
                LIMIT 8
            `),
            db.query(`
                SELECT id, name, price, image_url, stock, created_at
                FROM products
                WHERE stock <= 5
                ORDER BY stock ASC, name ASC
                LIMIT 10
            `)
        ]);

        return {
            sales: sales.rows[0],
            orders: orders.rows[0],
            customers: customers.rows[0],
            products: products.rows[0],
            recent_orders: recentOrders.rows,
            low_stock_products: lowStockProducts.rows
        };
    }
};

module.exports = AdminDashboard;
