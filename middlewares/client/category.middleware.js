const createTreeHelpers = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model")
module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newProductCategory = createTreeHelpers.tree(records);
  res.locals.layoutCategoryProducts = newProductCategory;
  next();
};
