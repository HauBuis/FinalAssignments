import React from "react";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img src="http://localhost:5000/images/logo.jpg" alt="Flower Shop Logo" className="logo" />
        <h1>Flower Shop</h1>
      </div>
    </header>
  );
}

export default Header;