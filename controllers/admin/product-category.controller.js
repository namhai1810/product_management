const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelpers = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index = async (req, res) =>{
  let find = {
    deleted: "false",
  };
  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelpers.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords
  });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: "false",
  }
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelpers.tree(records);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm danh mục sản phẩm",
    records: newRecords
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {


  if(req.body.position == ""){
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();
  
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) =>{

  try{
    const find = {
      deleted: false,
      _id: req.params.id,
    }
    const record = await ProductCategory.findOne(find);
    res.render("admin/pages/products-category/edit",{
      pageTitle: "Chỉnh sửa sản phẩm",
      record: record
    })

  }
  catch(err){
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
    return;
  }

}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) =>{

  if(req.body.position == ""){
    const countRecords = await ProductCategory.countDocuments();
    req.body.position = countRecords + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }

  try{
    await ProductCategory.updateOne({
      _id: req.params.id,
      deleted:false 
    }, req.body);
  }catch(error){
    req.flash("error", "Chỉnh sửa không thành công!");
    res.redirect(`back`);
    return;
  }
  res.redirect(`${systemConfig.prefixAdmin}/products-category/`);

}