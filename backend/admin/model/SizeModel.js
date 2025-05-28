const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Number, default: 1 }, // 1 là hoạt đồng 0 là ko hoạt động
  count: { type: Number, default: 1 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", //
    required: true,
  },
});

module.exports = mongoose.model("Size", sizeSchema);
