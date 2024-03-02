const homeRoutes = require("./home.route");
const productRoutes = require('./product.route');
const searchRoutes = require('./search.route');
const cartRoutes = require('./cart.route');
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) =>{
    app.use(cartMiddleware.cartId);
    app.use('/',categoryMiddleware.category, homeRoutes)
    app.use('/products',categoryMiddleware.category, productRoutes);
    app.use('/search',categoryMiddleware.category, searchRoutes);
    app.use('/cart',categoryMiddleware.category, cartRoutes);

    
} 