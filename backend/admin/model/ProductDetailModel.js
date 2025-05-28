const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductDetailSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
    size: { type: Schema.Types.ObjectId, ref: "Size", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    producttype: {
      type: Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    quantity: { type: Number, required: true },
    barcode: { type: String, required: true, unique: true },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

ProductDetailSchema.pre("find", function (next) {
  this.populate("color", "name");
  this.populate("size", "name");
  this.populate("category", "name");
  this.populate("producttype", "name");
  this.populate("product", "name importPrice salePrice");
  next();
});

module.exports = mongoose.model("ProductDetail", ProductDetailSchema);
