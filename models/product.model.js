const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: "",
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title" },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
// dat ten model la product
// products la ten collection trong database
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
