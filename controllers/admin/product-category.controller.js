const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelpers = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: "false",
  };
  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelpers.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: "false",
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelpers.tree(records);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if (permissions.include("products-category_create")) {
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } else {
    return;
  }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await ProductCategory.findOne(find);

    const data = await ProductCategory.find({ deleted: "false" });
    const newData = createTreeHelpers.tree(data);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      record: record,
      data: newData,
    });
  } catch (err) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
    return;
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    await ProductCategory.updateOne(
      {
        _id: req.params.id,
        deleted: false,
      },
      req.body
    );
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`back`);
    return;
  }
  req.flash("success", "Chỉnh sửa sản phẩm thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };
  try {
    const record = await ProductCategory.findOne(find);
    if (record.parent_id) {
      let parent = {
        _id: record.parent_id,
        deleted: false,
      };
      record.parent = await ProductCategory.findOne(parent);
    }
    res.render("admin/pages/products-category/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
    return;
  }
};
