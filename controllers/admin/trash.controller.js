const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system");
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

  res.render("admin/pages/trash/index", {
    pageTitle: "Danh sách sản phẩm đã xóa",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
  
} 