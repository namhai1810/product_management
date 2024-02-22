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