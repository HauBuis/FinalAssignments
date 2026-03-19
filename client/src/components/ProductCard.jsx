import React from "react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="product-image"
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(product.price)}
      </p>
    </div>
  );
}

export default ProductCard;