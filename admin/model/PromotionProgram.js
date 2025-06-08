// models/PromotionProgram.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromotionProgramSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["product_discount", "invoice_discount"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minInvoiceValue: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "expired"],
    default: "pending",
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("PromotionProgram", PromotionProgramSchema);
