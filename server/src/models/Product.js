const db = require("../config/database");


const Product = {


    async getAll(){

        const result = await db.query(
            `
            SELECT
                id,
                name,
                description,
                price,
                image_url,
                stock,
                category,
                created_at,
                updated_at
            FROM products
            ORDER BY created_at DESC
            `
        );

        return result.rows;
    },


    async getById(id){

        const result = await db.query(
            `
            SELECT
                id,
                name,
                description,
                price,
                image_url,
                stock,
                category,
                created_at,
                updated_at
            FROM products
            WHERE id=$1
            `,
            [id]
        );

        return result.rows[0];
    },


    async create(product){

        const {
            name,
            description,
            price,
            image_url,
            stock,
            category
        } = product;


        const result = await db.query(
            `
            INSERT INTO products
            (name, description, price, image_url, stock, category)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                name,
                description,
                price,
                image_url,
                stock,
                category,
                created_at,
                updated_at
            `,
            [
                name,
                description,
                price,
                image_url,
                stock,
                category
            ]
        );


        return result.rows[0];

    },

    async update(id, product){

    const {
        name,
        description,
        price,
        image_url,
        stock,
        category
    } = product;


    const result = await db.query(
        `
        UPDATE products
        SET
            name=COALESCE($1, name),
            description=COALESCE($2, description),
            price=COALESCE($3, price),
            image_url=COALESCE($4, image_url),
            stock=COALESCE($5, stock),
            category=COALESCE($6, category),
            updated_at=NOW()
        WHERE id=$7
        RETURNING
            id,
            name,
            description,
            price,
            image_url,
            stock,
            category,
            created_at,
            updated_at
        `,
        [
            name,
            description,
            price,
            image_url,
            stock,
            category,
            id
        ]
    );


    return result.rows[0];

},

    async delete(id){

        const result = await db.query(
            `
            DELETE FROM products
            WHERE id=$1
            RETURNING
                id,
                name,
                description,
                price,
                image_url,
                stock,
                category,
                created_at,
                updated_at
            `,
            [id]
        );

        return result.rows[0];

    }


};


module.exports = Product;
