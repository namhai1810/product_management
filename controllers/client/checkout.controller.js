const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const Order = require("../../models/order.model");
// [GET] /checkout/
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
    cartDetail: cart,
  });
};

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const cart_id = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cart_id,
  });
  let products = [];
  for (const item of cart.products) {
    const productInfo = await Product.findOne({
      _id: item.product_id,
    });
    const product = {
      product_id: item.product_id,
      price: productInfo.price,
      discountPercentage: productInfo.discountPercentage,
      quantity: item.quantity,
    };
    products.push(product);
  }
  const objectOrder = {
    cart_id: cart_id,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(objectOrder);
  await order.save();

  await Cart.updateOne(
    {
      _id: cart_id,
    },
    {
      products: [],
    }
  );
  res.send(`/checkout/success/${order.id}`);
};
