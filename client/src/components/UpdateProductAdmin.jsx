import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { PRODUCT_CATEGORIES } from "../utils/categories";
import { getProductId } from "../utils/products";
import {
  buildProductRequestData,
  createEmptyProductForm,
  mapProductToForm,
  validateProductForm,
} from "../utils/productAdmin";

function UpdateProductAdmin({
  products,
  onProductUpdated,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const formSectionRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState(createEmptyProductForm);
  const selectedProductId = getProductId(selectedProduct);

  function resetForm() {
    setSelectedProduct(null);
    setImagePreview(null);
    setFormData(createEmptyProductForm());
  }

  function handleFieldChange(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function startEditProduct(product) {
    setSelectedProduct(product);
    setFormData(mapProductToForm(product));
    setImagePreview(null);

    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
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

  async function handleUpdateProduct(event) {
    event.preventDefault();

    if (!selectedProduct) {
      alert("Chưa chọn sản phẩm để cập nhật.");
      return;
    }

    const validationMessage = validateProductForm(formData);

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/products/${getProductId(selectedProduct)}`,
        {
          method: "PUT",
          body: buildProductRequestData(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Cập nhật sản phẩm thất bại.");
      }

      const updatedProduct = await response.json().catch(() => null);
      const updatedProductId =
        getProductId(updatedProduct) || getProductId(selectedProduct);

      alert("Cập nhật sản phẩm thành công.");
      resetForm();
      await onProductUpdated?.();

      if (updatedProductId) {
        navigate(`/products/${updatedProductId}`);
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-form-section" ref={formSectionRef}>
      <h2>Cập nhật sản phẩm</h2>

      {!selectedProduct ? (
        <p>Vui lòng chọn sản phẩm cần cập nhật trong danh sách bên dưới.</p>
      ) : (
        <form onSubmit={handleUpdateProduct} className="admin-form">
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
            {loading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
          </button>
        </form>
      )}

      <h3 style={{ marginTop: "30px" }}>Danh sách sản phẩm</h3>
      {products.length === 0 ? (
        <p className="no-products">Không có sản phẩm.</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const productId = getProductId(product);

                return (
                <tr
                  key={productId}
                  style={{
                    backgroundColor:
                      selectedProductId === productId
                        ? "rgba(102, 126, 234, 0.1)"
                        : "transparent",
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{Number(product.price).toLocaleString("vi-VN")} VND</td>
                  <td>{product.stock}</td>
                  <td>{product.type?.name || "-"}</td>
                  <td>
                    <button
                      className="submit-btn"
                      type="button"
                      onClick={() => startEditProduct(product)}
                    >
                      Chọn để sửa
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UpdateProductAdmin;
