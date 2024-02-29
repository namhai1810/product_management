// [GET] /products
const Products = require("../../models/product.model");
const ProductsCategory = require("../../models/product-category.model");
const ProductsCategoryHelpers = require("../../helpers/productCategory");
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: "false",
  });
  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  res.render("clients/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: newProducts,
  });
};
// [GET] /products/:slugCategory

module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  const category = await ProductsCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const listSubCategory = await ProductsCategoryHelpers.getSubCategory(category._id);
  const listSubCategoryId = listSubCategory.map((item) => item.id);
  const products = await Products.find({
    product_category_id: {$in: [category.id,...listSubCategoryId]},
    deleted:false,
    status: "active",
  });

  res.render("clients/pages/products/index", {
    pageTitle: category.title,
    products: products
  });
};
