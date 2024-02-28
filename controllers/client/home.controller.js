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
  //lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find(find).sort({position:"desc"}).limit(6);
  const newProductsFeatured = productHelpers.priceNewProducts(productsFeatured);
  //kết thúc lấy ra sản phẩm nổi bật

  // Hiển thị danh sách sản phâm mới nhất
  const newProductsNew = await Product.find({
    status: "active",
    deleted:false,
  }).sort({position: "desc"}).limit(6);

  // Hết hiển thị danh sách sản phâm mới nhất

  res.render("clients/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    newProductsNew: newProductsNew
  });
};
