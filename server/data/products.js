const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, min: 0, default: 0 },

    image: { type: String, default: "/uploads/anh-san-pham.jpg" },
  },
  {
    collection: "products",
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
