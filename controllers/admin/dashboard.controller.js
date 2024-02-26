// [GET] /admin/dashboard
module.exports.dashboard = (req,res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Trang chủ",
    });
} 