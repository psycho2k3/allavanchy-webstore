const Product = require("../models/Product");


// Get all products
exports.getProducts = async(req,res)=>{

    try{

        const products =
        await Product.getAll();


        res.json(products);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Get product by ID
exports.getProduct = async(req,res)=>{

    try{

        const product =
        await Product.getById(req.params.id);


        if(!product){

            return res.status(404).json({
                message:"Product not found"
            });

        }


        res.json(product);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Create Product
exports.createProduct = async(req,res)=>{

    try{

        const product =
        await Product.create(req.body);


        res.status(201).json(product);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Delete Product
exports.deleteProduct = async(req,res)=>{

    try{

        await Product.delete(req.params.id);


        res.json({
            message:"Product deleted"
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};