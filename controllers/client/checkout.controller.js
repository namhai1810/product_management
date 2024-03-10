const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
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
  res.render("clients/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart
  });
};