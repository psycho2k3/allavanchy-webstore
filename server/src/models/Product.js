const db = require("../config/database");


const Product = {


    async getAll(){

        const result = await db.query(
            `
            SELECT *
            FROM products
            ORDER BY created_at DESC
            `
        );

        return result.rows;
    },


    async getById(id){

        const result = await db.query(
            `
            SELECT *
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
            stock
        } = product;


        const result = await db.query(
            `
            INSERT INTO products
            (name,description,price,image_url,stock)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                name,
                description,
                price,
                image_url,
                stock
            ]
        );


        return result.rows[0];

    },


    async delete(id){

        await db.query(
            `
            DELETE FROM products
            WHERE id=$1
            `,
            [id]
        );

    }


};


module.exports = Product;