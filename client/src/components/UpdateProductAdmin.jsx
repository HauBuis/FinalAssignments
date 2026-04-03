import React, { useState, useEffect } from "react";

function UpdateProductAdmin({ products, onProductUpdated, loading, setLoading }) {
  const API_BASE = "http://localhost:5000";
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    tags: "",
    imageFile: null,
  });

  const startEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.type?.name || "",
      stock: product.stock || "",
      tags: (product.tags || []).join(", "),
      imageFile: null,
    });
    setImagePreview(null);
  };

  async function handleUpdateProduct(e) {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Chưa chọn sản phẩm để cập nhật.");
      return;
    }

    if (!formData.name.trim() || formData.price === "") {
      alert("Vui lòng nhập tên và giá");
      return;
    }

    if (formData.stock === "") {
      alert("Vui lòng nhập tồn kho");
      return;
    }

    try {
      setLoading(true);
      const fData = new FormData();
      fData.append("name", formData.name);
      fData.append("price", formData.price);
      fData.append("description", formData.description);
      fData.append("stock", formData.stock);
      
      // Xử lý tags: phân tách theo dấu phẩy và trim khoảng trắng
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
      fData.append("tags", JSON.stringify(tagsArray));
      
      fData.append("type", JSON.stringify({ name: formData.category }));

      if (formData.imageFile) {
        fData.append("imageFile", formData.imageFile);
      }

      const res = await fetch(`${API_BASE}/api/products/${selectedProduct.id}`, {
        method: "PUT",
        body: fData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Cập nhật sản phẩm thất bại");
      }

      alert("Cập nhật sản phẩm thành công");
      setSelectedProduct(null);
      setImagePreview(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        tags: "",
        imageFile: null,
      });
      onProductUpdated();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="admin-form-section">
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả sản phẩm"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Giá (VNĐ) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Nhập giá"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Tồn kho (Số lượng) *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              placeholder="Nhập số lượng tồn kho"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Loại sản phẩm (Category)</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="VD: Bánh ngọt, Kẹo & Snack ngọt"
            />
          </div>

          <div className="form-group">
            <label>Tags (Nhãn)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="VD: tiệc thiếu nhi, dã ngoại, phần thưởng học sinh (cách nhau bằng dấu phẩy)"
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
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
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
          </button>
        </form>
      )}

      {/* Danh sách chọn sản phẩm */}
      <h3 style={{ marginTop: "30px" }}>Danh sách sản phẩm</h3>
      {products.length === 0 ? (
        <p className="no-products">Không có sản phẩm</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Tags</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    backgroundColor:
                      selectedProduct?.id === product.id
                        ? "rgba(102, 126, 234, 0.1)"
                        : "transparent",
                  }}
                >
                  <td>{product.name}</td>
                  <td>
                    {Number(product.price).toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    {product.tags && product.tags.length > 0
                      ? product.tags.join(", ")
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="submit-btn"
                      onClick={() => startEditProduct(product)}
                    >
                      Chọn để sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UpdateProductAdmin;
