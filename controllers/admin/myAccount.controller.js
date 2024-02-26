const Account = require("../../models/account.model")

// [GET] /admin/my-account
module.exports.index = (req,res) => {
  res.render("admin/pages/my-account/index", {
      pageTitle: "Thông tin cá nhân",
  });
} 

// [GET] /admin/my-account/edit
module.exports.edit = (req,res) => {

  res.render("admin/pages/my-account/edit", {
      pageTitle: "Thông tin cá nhân",
  });
} 

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req,res) => {
  
  const emailExist = await Account.findOne({
    _id: {$ne: res.locals.user.id},
    email: req.body.email,
    deleted: false,
  });
  if(emailExist){
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  if(req.body.password){
    req.body.password = md5(req.body.password);
  }else{
    delete req.body.password;
  }
  res.redirect("back");

} 