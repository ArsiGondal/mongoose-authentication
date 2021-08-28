const Product = require('./../models/productModel');

exports.createProduct = async (req , res , next) =>{
    try{
        const newProduct =await Product.create(req.body);
        res.status(201).json({
            status:'success',
            data :{
                product: newProduct
            }
        });
        next();
}catch(err){
    res.status(401).json({
        status:'fail',
        err
    });
    next();
}
}
    
exports.getAll =async (req, res, next) => {
    try{
        const products = await Product.find();

        // SEND RESPONSE
        res.status(200).json({
          status: 'success',
          results: products.length,
          data: {
            products
          }
        });
    }catch(err){
        res.status(401).json({
            status: 'fail',
            data: {
              err
            }
          });
    }
    
}