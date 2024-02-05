const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination.js");

// [GET] /admin/products

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: "false",
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
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

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  
  req.flash("success", "Cập nhập trạng thái sản phẩm thành công");
  res.redirect("back");
};

module.exports.changeMulti = async (req, res) => {
  console.log(req.body);

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
          deletedAt: new Date()
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
		default:
			break;
  }

  res.redirect("back");
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({_id:id});
  await Product.updateOne({_id:id}, {
    deleted:true,
    deletedAt: new Date(),
  });
  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect("back");
};