const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isValidEmail = (value) => {
    return typeof value === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};


// Register User
exports.register = async (req, res) => {

    try {

        const name = typeof req.body.name === "string"
            ? req.body.name.trim()
            : "";
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const { password } = req.body;

        if (!name || !isValidEmail(email) ||
            typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                message: "Name, a valid email, and a password of at least 8 characters are required"
            });
        }


        const existingUser = await User.findByEmail(email);


        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create(
            name,
            email,
            hashedPassword
        );


        res.status(201).json({
            message:"User created successfully",
            user
        });


    } catch(error){

        if (error.code === "23505") {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        res.status(500).json({
            error:error.message
        });

    }

};



// Login User
exports.login = async (req,res)=>{

    try{

        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";
        const { password } = req.body;

        if (!isValidEmail(email) || typeof password !== "string") {
            return res.status(400).json({
                message: "A valid email and password are required"
            });
        }


        const user = await User.findByEmail(email);


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        if(user.status === "suspended"){

            return res.status(403).json({
                message:"This account has been suspended"
            });

        }


        const validPassword =
        await bcrypt.compare(
            password,
            user.password
        );


        if(!validPassword){

            return res.status(401).json({
                message:"Invalid password"
            });

        }


        const token = jwt.sign(
            {
                id:user.id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({

            message:"Login successful",

            token,

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};
