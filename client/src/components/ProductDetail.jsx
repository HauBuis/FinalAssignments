import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  API_BASE_URL,
  DEFAULT_PRODUCT_IMAGE,
  getCategoryLabel,
  getImageUrl,
} from "./productShared";

function formatBadgeLabel(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function getOccasionLabels(product) {
  const tags = Array.isArray(product?.tags) ? product.tags : [];
  return [...new Set(tags.map(formatBadgeLabel).filter(Boolean))];
}

function getDisplayCategory(product) {
  const categoryId =
    typeof product?.type === "object" ? product?.type?.id : product?.type;

  return categoryId ? getCategoryLabel(categoryId) : "";
}

function ProductDetail() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);

        if (!response.ok) {
          setProduct(null);
          setError("Không thể tải sản phẩm.");
          return;
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setProduct(null);
        setError("Không thể kết nối tới server.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <p>{error || "Không tìm thấy sản phẩm."}</p>
        <button className="back-button" onClick={() => navigate("/products")}>
          Quay lại
        </button>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image || DEFAULT_PRODUCT_IMAGE);
  const occasionLabels = getOccasionLabels(product);
  const categoryLabel = getDisplayCategory(product);

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => navigate("/products")}>
        Quay lại
      </button>

      <div className="detail-container">
        <div className="detail-image">
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>

          <p className="detail-price">
            Giá:{" "}
            <strong>
              {Number(product.price || 0).toLocaleString("vi-VN")} VND
            </strong>
          </p>

          <p className="detail-stock">
            Tồn kho: <strong>{product.stock}</strong>
          </p>

          {product.description ? (
            <div className="detail-description">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>
          ) : null}

          {categoryLabel ? (
            <div className="detail-type">
              <h3>Loại sản phẩm</h3>
              <p>{categoryLabel}</p>
            </div>
          ) : null}

          {occasionLabels.length > 0 ? (
            <div className="detail-occasions">
              <h3>Phù hợp cho</h3>
              <div className="occasions-list">
                {occasionLabels.map((label, index) => (
                  <span key={`${label}-${index}`} className="occasion-badge">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {Number(product.stock) <= 0 ? (
            <p className="out-of-stock">Hết hàng</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
