const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req,res) => {
  let find = {
    deleted: false,
  };
  const records = await Roles.find(find);

  res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm quyền",
      records: records
  });
} 

// [GET] /admin/roles/create
module.exports.create = async (req,res) => {

  res.render("admin/pages/roles/create", {
      pageTitle: "Nhóm quyền",
  });
} 

// [POST] /admin/roles/create
module.exports.createPost = async (req,res) => {
  const record = new Roles(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`)
} 

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req,res) => {

  const find = {
    deleted: false,
    _id: req.params.id
  }
  try{
    const record = await Roles.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record
    });
  }
  catch(err){
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
} 

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req,res) => {
  await Roles.updateOne({
    _id: req.params.id,
    deleted: false
  }, req.body);
  req.flash("success", "Cập nhập nhóm quyền thành công");
  res.redirect("back");
} 