module.exports.createPost = (req, res, next) =>{
  if(!req.body.title){
    req.flash("error", "Vui lòng nhập tiêu để!");
    res.redirect("back");
    return;
  }
  next();

}

module.exports.decription = (req, res, next) =>{
  if(req.body.description.length < 20){
    req.flash("error", "Vui lòng nhập mô tả dài hơn!");
    res.redirect("back");
    return;
  }
  next();

}