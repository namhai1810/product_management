const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  cart.totalPrice = 0;
  for (const item of cart.products) {
    const product = await Product.findOne({
      _id: item.product_id,
    });
    product.priceNew = productHelper.priceNewProduct(product);
    item.productInfo = product;
    item.totalPrice = product.priceNew * item.quantity;
    cart.totalPrice += item.totalPrice;
  }

  res.render("clients/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  try {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    const cart = await Cart.findOne({
      _id: cartId,
    });

    const existProductInCart = cart.products.find(
      (item) => item.product_id === productId
    );
    if (existProductInCart) {
      const quantityNew = existProductInCart.quantity + quantity;
      await Cart.updateOne(
        {
          _id: cartId,
          "products.product_id": productId,
        },
        {
          $set: { "products.$.quantity": quantityNew },
        }
      );
    } else {
      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: { products: objectCart },
        }
      );
    }
    req.flash("success", "Thêm giỏ hàng thành công");
    res.redirect("back");
  } catch (err) {
    res.redirect("back");
  }
};

// [GET] /delete/:productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      "$pull":{
        "products": {
          product_id: productId
        }
      }
    }
  )
  req.flash("success", "Đã xóa sản phẩm thành công");
  res.redirect("back");
};

// [GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    }
  );
  req.flash("success", "Đã cập nhập số lượng thành công");

  res.redirect("back");
};