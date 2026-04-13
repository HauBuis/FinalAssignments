import React from "react";
import ProductCard from "./ProductCard";
import { getProductId } from "./productShared";

function ProductList({ products, onUpdate, onDelete }) {
  if (!products || products.length === 0) {
    return <p>Không có sản phẩm phù hợp.</p>;
  }

  return (
    <section className="product-list">
      {products.map((product) => (
        <ProductCard
          key={getProductId(product)}
          product={product}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default ProductList;
