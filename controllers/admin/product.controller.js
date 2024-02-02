// [GET] /admin/products

const Product = require("../../models/product.model");
module.exports.index = async (req,res) => {

    const filterStatusHelper = require("../../helpers/filterStatus.js");
    const filterStatus = filterStatusHelper(req.query.status);
    let find = {
        deleted:"false",
    };
    if(req.query.status){
        find.status = req.query.status
    }

    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    const products = await(Product.find(find));

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
} 