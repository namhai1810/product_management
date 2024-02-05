const mongoose = require('mongoose')
const productSchema = new mongoose.Schema(
    {
        title:String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: Boolean,
        deletedAt: Date
    }
);
// dat ten model la product
// products la ten collection trong database
const Product = mongoose.model('Product', productSchema,"products");

module.exports = Product