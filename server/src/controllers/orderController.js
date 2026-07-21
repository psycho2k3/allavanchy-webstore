const Order = require("../models/Order");



// Create Order
exports.createOrder = async(req,res)=>{

    try{


        const {
            user_id,
            total
        } = req.body;


        const order =
        await Order.create(
            user_id,
            total
        );


        res.status(201).json(order);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Get User Orders

exports.getOrders = async(req,res)=>{

    try{


        const orders =
        await Order.getUserOrders(
            req.params.user_id
        );


        res.json(orders);



    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};