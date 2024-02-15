// [GET] /products
const Product = require("../../models/product.model")
module.exports.index= async (req, res) => {
    const products = await Product.find({
        status:"active",
        deleted:"false"
    });
    const newProducts = products.map((item) =>{
        item.priceNew = (item.price * (100 -item.discountPercentage)/100).toFixed(0);
        return item;
    })

    res.render('clients/pages/products/index', {
        pageTitle:"Danh sach san pham",
        products: newProducts
    });
}
// [GET] /products/:slug

module.exports.detail= async (req, res) => {
    try{
        const find = {
          deleted: false,
          slug: req.params.slug,
        }
        const product  = await Product.findOne(find);
        res.render("clients/pages/products/detail",{
          pageTitle: product.title,
          product: product
        });
        
      }
      catch (err) {
        req.flash("error", "Sản phẩm không tồn tại!");
        res.redirect(`/products/`);
        return;
      }

}
