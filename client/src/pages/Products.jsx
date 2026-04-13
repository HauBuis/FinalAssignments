import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import { API_BASE_URL, getCategoryLabel } from "../components/productShared";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const keyword = searchParams.get("value") || "";
  const minStock = searchParams.get("minStock") || "";
  const maxStock = searchParams.get("maxStock") || "";
  const isKeywordSearch = location.pathname === "/products/search/keyword";
  const isStockSearch = Boolean(minStock || maxStock);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}${location.pathname}${location.search}`
        );
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [location.pathname, location.search]);

  function handleSearch(searchData) {
    if (searchData.type === "reset") {
      navigate("/products");
      return;
    }

    if (searchData.type === "keyword") {
      if (!searchData.value) {
        navigate("/products");
        return;
      }

      navigate(
        `/products/search/keyword?value=${encodeURIComponent(searchData.value)}`
      );
      return;
    }

    if (searchData.type === "stock") {
      const params = new URLSearchParams();

      if (searchData.minStock !== "") {
        params.set("minStock", searchData.minStock);
      }

      if (searchData.maxStock !== "") {
        params.set("maxStock", searchData.maxStock);
      }

      navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    }
  }

  function getPageTitle() {
    if (isKeywordSearch) {
      return keyword
        ? `Kết quả tìm kiếm: ${keyword}`
        : "Tìm kiếm sản phẩm";
    }

    if (isStockSearch) {
      if (minStock && maxStock) {
        return `Sản phẩm có tồn kho từ ${Number(minStock).toLocaleString(
          "vi-VN"
        )} đến ${Number(maxStock).toLocaleString("vi-VN")}`;
      }

      if (minStock) {
        return `Sản phẩm có tồn kho từ ${Number(minStock).toLocaleString(
          "vi-VN"
        )}`;
      }

      return `Sản phẩm có tồn kho đến ${Number(maxStock).toLocaleString(
        "vi-VN"
      )}`;
    }

    if (category) {
      return `Danh sách ${getCategoryLabel(category)}`;
    }

    return "Danh sách sản phẩm";
  }

  return (
    <div className="products-page">
      <h1>{getPageTitle()}</h1>
      <SearchBar
        initialKeyword={keyword}
        initialMinStock={minStock}
        initialMaxStock={maxStock}
        onSearch={handleSearch}
      />

      {loading ? (
        <p className="loading">Đang tải dữ liệu...</p>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}

export default Products;
