const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type : String,
        required : [true , 'Please provide product name!']
    }
})

const Product = mongoose.model('Product' , productSchema);
module.exports = Product;