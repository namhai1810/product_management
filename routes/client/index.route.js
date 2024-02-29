const homeRoutes = require("./home.route");
const productRoutes = require('./product.route')
const categoryMiddleware = require("../../middlewares/client/category.middleware")

module.exports = (app) =>{
    app.use('/',categoryMiddleware.category, homeRoutes)
    app.use('/products',categoryMiddleware.category, productRoutes);
    
} 