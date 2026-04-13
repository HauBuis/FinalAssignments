import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();

  // Determine current page from location path for sidebar highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/products") return "products";
    if (path.startsWith("/detail")) return "detail";
    if (path.startsWith("/admin")) return "admin";
    return "home";
  };

  const currentPage = getCurrentPage();

  return (
    <div className="app-layout">
      <Header />
      <Sidebar currentPage={currentPage} />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/admin/:mode?" element={<Admin />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;