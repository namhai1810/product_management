const Product = require("../../models/product.model");
const productHelpers = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let products;
  if(keyword){
    const regexKey = new RegExp(keyword,"i");
    products = await Product.find({
      title: regexKey,
      status: "active",
      deleted: false,
    })
  }
  const newProducts = productHelpers.priceNewProducts(products);
  res.render("clients/pages/search/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
}