const db = require("../config/database");


const Order = {


    async create(user_id,total){

        const result = await db.query(
            `
            INSERT INTO orders
            (user_id,total)
            VALUES($1,$2)
            RETURNING *
            `,
            [
                user_id,
                total
            ]
        );


        return result.rows[0];

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

    }


};


module.exports = Order;