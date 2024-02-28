const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const createTreeHelpers = require("../../helpers/createTree");
const productHelpers = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  const find = {
    featured: "1",
    status: "active",
    deleted: false,
  }
  const productsFeatured = await Product.find(find).sort({position:"desc"}).limit(6);
  const products = productHelpers.priceNewProducts(productsFeatured);
  res.render("clients/pages/home/index", {
    pageTitle: "Trang chủ",
    products: products
  });
};
