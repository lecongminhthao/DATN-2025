const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", colorSchema);
module.exports = Color;
