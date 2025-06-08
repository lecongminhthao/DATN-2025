// models/ProductPromotion.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductPromotionSchema = new Schema({
  promotionProgram: {
    type: Schema.Types.ObjectId,
    ref: "PromotionProgram",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("ProductPromotion", ProductPromotionSchema);
