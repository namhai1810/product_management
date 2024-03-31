// [GET] /chat/
module.exports.index = (req, res) => {
  res.render("clients/pages/chat/index",{
    pageTitle:"Chat",
  })
}
