import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi fetch API:", err));
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <ProductList products={products} />
      </div>
    </div>
  );
}

export default Home;