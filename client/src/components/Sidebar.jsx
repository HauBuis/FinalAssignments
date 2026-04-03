import React from "react";

function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Menu</h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          🏠 Trang chủ
        </button>

        <button
          className={`sidebar-link ${currentPage === "products" ? "active" : ""}`}
          onClick={() => onNavigate("products")}
        >
          🍰 Sản phẩm
        </button>

        <button
          className={`sidebar-link ${currentPage === "admin" ? "active" : ""}`}
          onClick={() => onNavigate("admin")}
        >
          ⚙️ Admin
        </button>

        <button
          className="sidebar-link"
          onClick={() => onNavigate("home")}
        >
          ℹ️ Liên hệ
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;