const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    url: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
