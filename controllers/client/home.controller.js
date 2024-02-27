const ProductCategory = require("../../models/product-category.model");
const createTreeHelpers = require("../../helpers/createTree");
// [GET] /
module.exports.index = async (req, res) => {
 
  res.render("clients/pages/home/index", {
    pageTitle: "Trang chủ",

  });
};
