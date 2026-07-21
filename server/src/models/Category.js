const db = require("../config/database");


const Category = {


    async getAll(){

        const result = await db.query(
            `
            SELECT *
            FROM categories
            ORDER BY name
            `
        );

        return result.rows;

    },


    async create(name){

        const result = await db.query(
            `
            INSERT INTO categories(name)
            VALUES($1)
            RETURNING *
            `,
            [name]
        );


        return result.rows[0];

    }


};


module.exports = Category;