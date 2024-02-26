const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model")
// [GET] /admin/trash
module.exports.index = async (req,res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: "true",
  };

  if(req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex){
    find.title = objectSearch.regex;
  }

  // pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  //end pagination

  const products = await Product.find(find)
    .sort({position: "desc"})
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  
  for(const product of products){
    const account = await Account.findOne({_id: product.deletedBy.account_id});
    if(account){
      product.accountFullName = account.fullName;
    }
  }
  
  res.render("admin/pages/trash/index", {
    pageTitle: "Danh sách sản phẩm đã xóa",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
} 
// [patch] admin/trash/:status/:id
module.exports.changeStatus = async (req, res) =>{
  const status = req.params.status;
  const id = req.params.id;
  if(status === "restore"){
    await Product.updateOne({_id:id}, {deleted:false});
  }else{
    await Product.deleteOne({_id:id});
  }
  req.flash("success", `Cập nhập trạng thái của sản phẩm thành công`);

  res.redirect("back");

}

// [PATCH] /admin/trash/change-multi?_method=PATCH
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);

      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } }, 
        { deleted:true,
          deletedBy:{
            account_id: res.locals.user.id,
            deletedAt: Date.now(),
          },
        });
      req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);

      break;
    case "change-position":
        for(const item of ids){
          let [id, position] = item.split("-");
          position = parseInt(position);
          await Product.updateOne({_id : id}, {
            position: position
          });
        }
        req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);
    case "restore":
      await Product.updateMany(
        { _id: { $in: ids } }, 
        { deleted:false,
          deletedAt: new Date()
        });
      req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);
      break;
    case "delete-forever":
        await Product.deleteMany({ _id: { $in: ids } });
        req.flash("success", `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`);
        break;
    default:
			break;
  }
  res.redirect("back");
};