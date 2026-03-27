const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },

    name: { type: String, required: true, trim: true },

    description: { type: String },

    price: { type: Number, required: true, min: 0 },

    image: { type: String, required: true },

    stock: { type: Number, min: 0, default: 0 },

    category: {
      id: { type: String },
      name: { type: String },
    },

    events: [{ type: String }],
  },
  {
    collection: "products",
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);