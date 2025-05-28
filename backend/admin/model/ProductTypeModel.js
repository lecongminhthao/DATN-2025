// models/ProductTypeModel.js
const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  status: { type: Number, default: 1 },
});

module.exports = mongoose.model("ProductType", productTypeSchema);
