const db = require("../config/database");


const User = {

    async create(name, email, password, role = "customer") {

        const result = await db.query(
            `
            INSERT INTO users
            (name, email, password, role)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [name, email, password, role]
        );

        return result.rows[0];
    },


    async findByEmail(email){

        const result = await db.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        return result.rows[0];
    },


    async findById(id){

        const result = await db.query(
            `
            SELECT *
            FROM users
            WHERE id=$1
            `,
            [id]
        );

        return result.rows[0];
    }

};


module.exports = User;