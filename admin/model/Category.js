const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Number, default: 1 }, // Hoạt động: 1, Không hoạt động: 0
  count: { type: Number, default: 1 },
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
