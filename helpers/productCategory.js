const ProductsCategory = require("../models/product-category.model")
// lấy ra các danh mục từ danh mục cha
module.exports.getSubCategory = async (parentId) => {
  const getsCategory = async (parentId) => {
    const subCategory = await ProductsCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });
    console.log(subCategory)
    let subAll = [...subCategory];
    for (const sub of subCategory) {
      const childs = await getsCategory(sub.id);
      subAll = subAll.concat(childs);
    }
    return subAll;
  };
  const listSubCategory = await getsCategory(parentId);
  return listSubCategory;
}
// Kết thúc lấy ra các danh mục từ danh mục cha
