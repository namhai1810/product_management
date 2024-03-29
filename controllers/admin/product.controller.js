const Product = require("../../models/product.model");
const Account = require("../../models/account.model");

const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system");
const createTreeHelpers = require("../../helpers/createTree");

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
  //sort
  sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort["position"] = "desc";
  }
  //end sort
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // lấy ra thông tin người tạo
    const account = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (account) {
      product.accountFullName = account.fullName;
    }
    
    // lấy ra thông tin nguời cập nhập gần nhất 
    const updatedBy = product.updatedBy.slice(-1)[0];
    if(updatedBy){
      const accountUpdate = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = accountUpdate.fullName;
    }
    
  }

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
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );

  req.flash("success", "Cập nhập trạng thái sản phẩm thành công");
  res.redirect("back");
};
// [PATCH] /admin/products/changeMulti?_method=PATCH
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active",$push: { updatedBy: updatedBy } });
      req.flash(
        "success",
        `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`
      );

      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive",$push: { updatedBy: updatedBy } });
      req.flash(
        "success",
        `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date.now(),
          },
          $push: { updatedBy: updatedBy }
        }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`
      );

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy }

          },
        );
      }
      req.flash(
        "success",
        `Cập nhập trạng thái của ${ids.length} sản phẩm thành công`
      );
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id?_method=DELETE
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({_id:id});
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: Date.now(),
      },
    }
  );
  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const product = await ProductCategory.find({
    deleted: false,
  });
  const newProduct = createTreeHelpers.tree(product);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    product: newProduct,
  });
};

// [POST] /admin/products/create

module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products/`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);

    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelpers.tree(records);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      records: records,
    });
  } catch (err) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products/`);
    return;
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
  } catch (error) {
    req.flash("error", "Chỉnh sửa không thành công!");
    res.redirect(`back`);
    return;
  }
  res.redirect(`${systemConfig.prefixAdmin}/products/`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (err) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products/`);
    return;
  }
};
