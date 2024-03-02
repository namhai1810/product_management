const Cart = require("../../models/cart.model");
// [POST] /
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  try{
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
    const cart = await Cart.findOne({
      _id: cartId,
    })

    const existProductInCart = cart.products.find(item => item.product_id === productId);
    if(existProductInCart){
      const quantityNew = existProductInCart.quantity + quantity;
      await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
      }, {
        $set: { "products.$.quantity": quantityNew }
      });
    }
    else{
      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push:{products:objectCart}
        }
      );
    }
    req.flash('success',"Thêm giỏ hàng thành công")    
    res.redirect("back")

  }
  catch(err){
    res.redirect("back");
  }
};
