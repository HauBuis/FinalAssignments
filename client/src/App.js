import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handlePageChange = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <Sidebar currentPage={currentPage} onNavigate={handlePageChange} />

      <div className="main-content">
        {currentPage === "home" && (
          <Home onNavigate={handlePageChange} />
        )}
        {currentPage === "products" && (
          <Products onNavigate={handlePageChange} />
        )}
        {currentPage === "detail" && selectedProductId && (
          <ProductDetail
            productId={selectedProductId}
            onNavigate={handlePageChange}
          />
        )}
        {currentPage === "admin" && (
          <Admin onNavigate={handlePageChange} />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;