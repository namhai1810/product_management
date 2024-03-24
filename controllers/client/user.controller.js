const User = require("../../models/user.model");
const md5 = require("md5");
const ForgotPassword = require("../../models/forgot-password.model")
const generateHelper = require("../../helpers/generate")
// [GET]  user/register
module.exports.register = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  res.render("clients/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [POST] user/register
module.exports.registerPost = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  const emailExists = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExists) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

// [GET] user/login
module.exports.login = (req, res) => {
  res.render("clients/pages/user/login.pug", {
    pageTitle: "Đăng nhập",
  });
};

// [GET] user/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    req.flash("error", "Tài khoản không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Vui lòng nhập đúng mật khẩu");
    res.redirect("back");
    return;
  }
  if (user.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

// [GET] user/logout
module.exports.logout = (req,res ) =>{
  res.clearCookie("tokenUser");
  res.redirect("/");
} 

// [GET] user/forgotPassword
module.exports.forgotPassword = (req,res ) =>{
  res.render("clients/pages/user/forgot-password",{
    pageTitle: "Lấy lại mật khẩu"
  });
} 

// [POST] user/forgotPassword
module.exports.forgotPasswordPost = async (req,res ) =>{
  const email = req.body.email;
  const user = User.findOne({
    email: email,
    deleted:false
  });
  if(!user){
    req.flash("error", "Tài khoản không tồn tại");
    res.redirect("back");
    return;
  }

  // Việc 1: tạo mã otp và tạo collections để lưu nó OTP và email (forgot-password)
  const otp = generateHelper.generateRandomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now()
  }
  const record = new ForgotPassword(objectForgotPassword);
  await record.save();

  // Việc 2: Gửi OTP qua email user
  res.redirect(`/user/password/otp?email=${email}`)
} 

// [GET] /password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;
  res.render("clients/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  })
}

// [POST] user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const record = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if(!record){
    req.flash("error", "OTP không hợp lệ!");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
}

// [GET] user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("clients/pages/user/reset-password",{
    pageTitle: "Đổi mật khẩu"
  })
}
// [POST] user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  try {
    await User.updateOne({
      tokenUser: tokenUser
    },{
      password: md5(password)
    });
    res.redirect("/");
  }catch (err) {
    console.log(error);
  }
}