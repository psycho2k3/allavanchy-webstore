const db = require("../config/database");


const Collection = {


    async getAll() {

        const result = await db.query(
            `
            SELECT
                c.id,
                c.name,
                c.subtitle,
                c.image_url,
                c.created_at,
                c.updated_at,
                COUNT(cp.product_id)::int AS product_count
            FROM collections c
            LEFT JOIN collection_products cp ON cp.collection_id = c.id
            GROUP BY c.id
            ORDER BY c.created_at DESC
            `
        );

        return result.rows;

    },


    async getById(id) {

        const collectionResult = await db.query(
            `
            SELECT id, name, subtitle, image_url, created_at, updated_at
            FROM collections
            WHERE id = $1
            `,
            [id]
        );

        const collection = collectionResult.rows[0];

        if (!collection) return null;

        const productsResult = await db.query(
            `
            SELECT
                p.id,
                p.name,
                p.price,
                p.image_url,
                p.category,
                p.stock
            FROM collection_products cp
            JOIN products p ON p.id = cp.product_id
            WHERE cp.collection_id = $1
            ORDER BY p.name ASC
            `,
            [id]
        );

        return {
            ...collection,
            products: productsResult.rows
        };

    },


    async create({ name, subtitle, image_url }) {

        const result = await db.query(
            `
            INSERT INTO collections
            (name, subtitle, image_url)
            VALUES ($1, $2, $3)
            RETURNING id, name, subtitle, image_url, created_at, updated_at
            `,
            [name, subtitle, image_url]
        );

        return result.rows[0];

    },


    async update(id, { name, subtitle, image_url }) {

        const result = await db.query(
            `
            UPDATE collections
            SET
                name=COALESCE($1, name),
                subtitle=COALESCE($2, subtitle),
                image_url=COALESCE($3, image_url),
                updated_at=NOW()
            WHERE id=$4
            RETURNING id, name, subtitle, image_url, created_at, updated_at
            `,
            [name, subtitle, image_url, id]
        );

        return result.rows[0];

    },


    async delete(id) {

        const result = await db.query(
            `
            DELETE FROM collections
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        return result.rows[0];

    },


    async setProducts(collectionId, productIds) {

        const client = await db.connect();

        try {

            await client.query("BEGIN");

            await client.query(
                `DELETE FROM collection_products WHERE collection_id = $1`,
                [collectionId]
            );

            for (const productId of productIds) {
                await client.query(
                    `
                    INSERT INTO collection_products (collection_id, product_id)
                    VALUES ($1, $2)
                    `,
                    [collectionId, productId]
                );
            }

            await client.query("COMMIT");

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }

    }


};


module.exports = Collection;