// [GET] /products
const Products = require("../../models/product.model");
const ProductsCategory = require("../../models/product-category.model");
const ProductsCategoryHelpers = require("../../helpers/productCategory");
const productHelpers = require("../../helpers/product")
// [GET] /
module.exports.index = async (req, res) => {
  const products = await Products.find({
    status: "active",
    deleted: "false",
  });
  const newProducts = productHelpers.priceNewProducts(products);
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
  });

  const listSubCategory = await ProductsCategoryHelpers.getSubCategory(category._id);
  const listSubCategoryId = listSubCategory.map((item) => item.id);
  const products = await Products.find({
    product_category_id: {$in: [category.id,...listSubCategoryId]},
    deleted:false,
    status: "active",
  });
  const newProducts = productHelpers.priceNewProducts(products);

  res.render("clients/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  });
};

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try{
    const slugProduct = req.params.slugProduct;
    const product = await Products.findOne({
      slug: slugProduct,
      status: "active",
      deleted: false,
    });
    if(product.product_category_id){
      const category = await ProductsCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });
      product.category = category;
    }
    product.priceNew = productHelpers.priceNewProduct(product);

    res.render("clients/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  }
  catch (err) {
    res.redirect("/products");
  }
};
