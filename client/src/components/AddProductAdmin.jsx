import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { PRODUCT_CATEGORIES } from "../utils/categories";
import { getProductId } from "../utils/products";
import {
  buildProductRequestData,
  createEmptyProductForm,
  validateProductForm,
} from "../utils/productAdmin";

function AddProductAdmin({ onProductAdded, loading, setLoading }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createEmptyProductForm);
  const [imagePreview, setImagePreview] = useState(null);

  function handleFieldChange(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      handleFieldChange("imageFile", null);
      setImagePreview(null);
      return;
    }

    handleFieldChange("imageFile", file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleAddProduct(event) {
    event.preventDefault();

    const validationMessage = validateProductForm(formData);

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: buildProductRequestData(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Tạo sản phẩm thất bại.");
      }

      const createdProduct = await response.json().catch(() => null);
      const createdProductId = getProductId(createdProduct);

      alert("Thêm sản phẩm thành công.");
      setFormData(createEmptyProductForm());
      setImagePreview(null);
      await onProductAdded?.();

      if (createdProductId) {
        navigate(`/products/${createdProductId}`);
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-form-section">
      <h2>Thêm sản phẩm mới</h2>

      <form onSubmit={handleAddProduct} className="admin-form">
        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(event) =>
              handleFieldChange("description", event.target.value)
            }
            placeholder="Nhập mô tả sản phẩm"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Giá (VND) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(event) => handleFieldChange("price", event.target.value)}
            placeholder="Nhập giá"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Tồn kho *</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(event) => handleFieldChange("stock", event.target.value)}
            placeholder="Nhập số lượng tồn kho"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Loại sản phẩm *</label>
          <select
            value={formData.category}
            onChange={(event) =>
              handleFieldChange("category", event.target.value)
            }
            required
          >
            <option value="">Chọn loại sản phẩm</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(event) => handleFieldChange("tags", event.target.value)}
            placeholder="Ví dụ: sinh nhật, tặng quà"
          />
        </div>

        <div className="form-group">
          <label>Sự kiện</label>
          <input
            type="text"
            value={formData.events}
            onChange={(event) => handleFieldChange("events", event.target.value)}
            placeholder="Ví dụ: sinh nhật, kỷ niệm"
          />
        </div>

        <div className="form-group">
          <label>Hình ảnh</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview ? (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : null}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
        </button>
      </form>
    </section>
  );
}

export default AddProductAdmin;
