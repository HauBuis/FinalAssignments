const express = require("express");
const cors = require("cors");
const products = require("./data/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/api/products", (req, res) => {
  console.log("API /api/products called");
  res.json(products);
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:5000");
});