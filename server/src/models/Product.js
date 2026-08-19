const db = require("../config/database");

const productColumns = `
    id,
    name,
    description,
    price,
    image_url,
    image_urls,
    stock,
    category,
    sizes,
    created_at,
    updated_at
`;

const Product = {

    // =================================================
    // GET ALL
    // =================================================

    async getAll() {
        const result = await db.query(
            `
            SELECT
                ${productColumns}
            FROM products
            ORDER BY created_at DESC
            `
        );

        return result.rows;
    },

    // =================================================
    // GET BY ID
    // =================================================

    async getById(id) {
        const result = await db.query(
            `
            SELECT
                ${productColumns}
            FROM products
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0];
    },

    // =================================================
    // CREATE
    // =================================================

    async create(product) {
        const {
            name,
            description,
            price,
            image_url,
            image_urls,
            stock,
            category,
            sizes
        } = product;

        const result = await db.query(
            `
            INSERT INTO products
            (
                name,
                description,
                price,
                image_url,
                image_urls,
                stock,
                category,
                sizes
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            RETURNING
                ${productColumns}
            `,
            [
                name,
                description || "",
                price,
                image_url,
                image_urls || [],
                stock,
                category || "",
                sizes || []
            ]
        );

        return result.rows[0];
    },

    // =================================================
    // UPDATE
    // =================================================

    async update(id, product) {

        const {
            name,
            description,
            price,
            image_url,
            image_urls,
            stock,
            category,
            sizes
        } = product;

        const result = await db.query(
            `
            UPDATE products
            SET
                name =
                    COALESCE(
                        $1,
                        name
                    ),

                description =
                    COALESCE(
                        $2,
                        description
                    ),

                price =
                    COALESCE(
                        $3,
                        price
                    ),

                image_url =
                    COALESCE(
                        $4,
                        image_url
                    ),

                image_urls =
                    COALESCE(
                        $5,
                        image_urls
                    ),

                stock =
                    COALESCE(
                        $6,
                        stock
                    ),

                category =
                    COALESCE(
                        $7,
                        category
                    ),

                sizes =
                    COALESCE(
                        $8,
                        sizes
                    ),

                updated_at = NOW()

            WHERE id = $9

            RETURNING
                ${productColumns}
            `,
            [
                name,
                description,
                price,
                image_url,
                image_urls,
                stock,
                category,
                sizes,
                id
            ]
        );

        return result.rows[0];
    },

    // =================================================
    // DELETE
    // =================================================

    async delete(id) {
        const result = await db.query(
            `
            DELETE FROM products
            WHERE id = $1

            RETURNING
                ${productColumns}
            `,
            [id]
        );

        return result.rows[0];
    }
};

module.exports = Product;