const Product = require("../models/Product");

const isValidId = (id) => {
    return Number.isInteger(Number(id)) && Number(id) > 0;
};

const hasText = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};

const isValidNumber = (value) => {
    return value !== undefined && value !== null && !Number.isNaN(Number(value));
};

const validateCreateProduct = (product) => {
    const errors = [];

    if (!hasText(product.name)) {
        errors.push("Name is required");
    }

    if (!isValidNumber(product.price) || Number(product.price) < 0) {
        errors.push("Price must be a valid non-negative number");
    }

    if (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0) {
        errors.push("Stock must be a valid non-negative integer");
    }

    if (product.description !== undefined && typeof product.description !== "string") {
        errors.push("Description must be text");
    }

    if (product.image_url !== undefined && typeof product.image_url !== "string") {
        errors.push("Image URL must be text");
    }

    if (product.category !== undefined && typeof product.category !== "string") {
        errors.push("Category must be text");
    }

    return errors;
};

const validateUpdateProduct = (product) => {
    const errors = [];

    if (Object.keys(product).length === 0) {
        errors.push("At least one product field is required");
    }

    if (product.name !== undefined && !hasText(product.name)) {
        errors.push("Name must not be empty");
    }

    if (product.price !== undefined && (!isValidNumber(product.price) || Number(product.price) < 0)) {
        errors.push("Price must be a valid non-negative number");
    }

    if (
        product.stock !== undefined &&
        (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0)
    ) {
        errors.push("Stock must be a valid non-negative integer");
    }

    if (product.description !== undefined && typeof product.description !== "string") {
        errors.push("Description must be text");
    }

    if (product.image_url !== undefined && typeof product.image_url !== "string") {
        errors.push("Image URL must be text");
    }

    if (product.category !== undefined && typeof product.category !== "string") {
        errors.push("Category must be text");
    }

    return errors;
};


// Get all products
exports.getProducts = async(req,res)=>{

    try{

        const products =
        await Product.getAll();


        res.json(products);


    }catch(error){

        res.status(500).json({
            message:"Failed to fetch products",
            error:error.message
        });

    }

};



// Get product by ID
exports.getProduct = async(req,res)=>{

    try{

        if(!isValidId(req.params.id)){
            return res.status(400).json({
                message:"Invalid product id"
            });
        }

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
            message:"Failed to fetch product",
            error:error.message
        });

    }

};



// Create Product
exports.createProduct = async(req,res)=>{

    console.log(req.body);
    console.log(req.file);
    
    try{

        const errors = validateCreateProduct(req.body);

        if(errors.length > 0){
            return res.status(400).json({
                message:"Invalid product input",
                errors
            });
        }

        const product =
        await Product.create(req.body);


        res.status(201).json(product);


    }catch(error){

        res.status(500).json({
            message:"Failed to create product",
            error:error.message
        });

    }

};

// Update Product
exports.updateProduct = async(req,res)=>{

    try{

        if(!isValidId(req.params.id)){
            return res.status(400).json({
                message:"Invalid product id"
            });
        }

        const errors = validateUpdateProduct(req.body);

        if(errors.length > 0){
            return res.status(400).json({
                message:"Invalid product input",
                errors
            });
        }

        const product =
        await Product.update(
            req.params.id,
            req.body
        );

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }

        res.json(product);

    }catch(error){

        res.status(500).json({
            message:"Failed to update product",
            error:error.message
        });

    }

};



// Delete Product
exports.deleteProduct = async(req,res)=>{

    try{

        if(!isValidId(req.params.id)){
            return res.status(400).json({
                message:"Invalid product id"
            });
        }

        const product =
        await Product.delete(req.params.id);

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }


        res.json({
            message:"Product deleted",
            product
        });


    }catch(error){

        res.status(500).json({
            message:"Failed to delete product",
            error:error.message
        });

    }

};
