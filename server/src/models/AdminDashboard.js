const db = require("../config/database");

const AdminDashboard = {
    async getMetrics() {
        const [
            sales,
            orderCounts,
            customers,
            products,
            recentOrders,
            lowStockProducts,
            recentUsers,
            recentProducts
        ] = await Promise.all([
            db.query(`
                SELECT COALESCE(SUM(total), 0)::numeric AS total_revenue
                FROM orders
            `),
            db.query(`
                SELECT
                    COUNT(*)::int AS total_orders,
                    COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending_orders,
                    COUNT(*) FILTER (WHERE status IN ('Delivered', 'Completed'))::int AS completed_orders,
                    COUNT(*) FILTER (WHERE status = 'Cancelled')::int AS cancelled_orders
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
                    COUNT(*) FILTER (WHERE stock <= 5 AND stock > 0)::int AS low_stock_count,
                    COUNT(*) FILTER (WHERE stock = 0)::int AS out_of_stock_count
                FROM products
            `),
            db.query(`
                SELECT
                    o.id,
                    o.user_id,
                    o.total,
                    o.status,
                    o.created_at,
                    u.name AS customer_name,
                    u.email AS customer_email
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                ORDER BY o.created_at DESC
                LIMIT 8
            `),
            db.query(`
                SELECT id, name, price, image_url, stock, created_at
                FROM products
                WHERE stock <= 5
                ORDER BY stock ASC, name ASC
                LIMIT 10
            `),
            db.query(`
                SELECT id, name, email, role, created_at
                FROM users
                ORDER BY created_at DESC
                LIMIT 8
            `),
            db.query(`
                SELECT id, name, price, image_url, category, created_at
                FROM products
                ORDER BY created_at DESC
                LIMIT 8
            `)
        ]);

        return {
            sales: sales.rows[0],
            orders: orderCounts.rows[0],
            customers: customers.rows[0],
            products: products.rows[0],
            recent_orders: recentOrders.rows,
            low_stock_products: lowStockProducts.rows,
            recent_users: recentUsers.rows,
            recent_products: recentProducts.rows
        };
    }
};

module.exports = AdminDashboard;