import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddProductAdmin from "../components/AddProductAdmin";
import DeleteProductAdmin from "../components/DeleteProductAdmin";
import ImportProductsAdmin from "../components/ImportProductsAdmin";
import UpdateProductAdmin from "../components/UpdateProductAdmin";
import { API_BASE_URL } from "../utils/api";

const DEFAULT_MODE = "add";

function Admin() {
  const { mode: routeMode } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const mode = routeMode || DEFAULT_MODE;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function renderAdminSection() {
    const sharedProps = {
      loading,
      setLoading,
    };

    switch (mode) {
      case "update":
        return (
          <UpdateProductAdmin
            {...sharedProps}
            products={products}
            onProductUpdated={loadProducts}
          />
        );
      case "delete":
        return (
          <DeleteProductAdmin
            {...sharedProps}
            products={products}
            onProductDeleted={loadProducts}
          />
        );
      case "import":
        return (
          <ImportProductsAdmin
            {...sharedProps}
            onProductsImported={loadProducts}
          />
        );
      case "add":
      default:
        return (
          <AddProductAdmin
            {...sharedProps}
            onProductAdded={loadProducts}
          />
        );
    }
  }

  return (
    <div className="admin-page">
      <button className="back-button" onClick={() => navigate("/")}>
        Quay lại
      </button>

      <h1>Quản lý sản phẩm</h1>

      <div className="admin-container">{renderAdminSection()}</div>
    </div>
  );
}

export default Admin;
