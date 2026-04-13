import React, { useEffect, useState } from "react";

function SearchBar({
  initialKeyword = "",
  initialMinStock = "",
  initialMaxStock = "",
  onSearch,
}) {
  const [searchType, setSearchType] = useState("keyword");
  const [keyword, setKeyword] = useState(initialKeyword);
  const [minStock, setMinStock] = useState(initialMinStock);
  const [maxStock, setMaxStock] = useState(initialMaxStock);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setMinStock(initialMinStock);
    setMaxStock(initialMaxStock);
  }, [initialMinStock, initialMaxStock]);

  function handleSearch() {
    setMessage("");

    if (searchType === "keyword") {
      onSearch({
        type: "keyword",
        value: keyword.trim(),
      });
      return;
    }

    const normalizedMinStock = minStock.trim();
    const normalizedMaxStock = maxStock.trim();
    const parsedMinStock =
      normalizedMinStock !== "" ? Number(normalizedMinStock) : null;
    const parsedMaxStock =
      normalizedMaxStock !== "" ? Number(normalizedMaxStock) : null;

    if (
      (parsedMinStock !== null && parsedMinStock < 0) ||
      (parsedMaxStock !== null && parsedMaxStock < 0)
    ) {
      setMessage("Tồn kho không được nhỏ hơn 0.");
      return;
    }

    if (
      normalizedMinStock !== "" &&
      normalizedMaxStock !== "" &&
      parsedMinStock > parsedMaxStock
    ) {
      setMessage("Tồn kho từ không được lớn hơn tồn kho đến.");
      return;
    }

    onSearch({
      type: "stock",
      minStock: normalizedMinStock,
      maxStock: normalizedMaxStock,
    });
  }

  function handleReset() {
    setKeyword("");
    setMinStock("");
    setMaxStock("");
    setMessage("");
    onSearch({ type: "reset" });
  }

  return (
    <div className="search-bar">
      <div className="search-type-selector">
        <label>
          <input
            type="radio"
            value="keyword"
            checked={searchType === "keyword"}
            onChange={(event) => {
              setSearchType(event.target.value);
              setMessage("");
            }}
          />
          Tìm theo từ khóa
        </label>
        <label>
          <input
            type="radio"
            value="stock"
            checked={searchType === "stock"}
            onChange={(event) => {
              setSearchType(event.target.value);
              setMessage("");
            }}
          />
          Tìm theo tồn kho
        </label>
      </div>

      {searchType === "keyword" ? (
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Nhập tên, loại sản phẩm hoặc từ khóa"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="search-input"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      ) : (
        <div className="search-input-group">
          <input
            type="number"
            placeholder="Tồn kho từ"
            value={minStock}
            onChange={(event) => setMinStock(event.target.value)}
            className="search-input"
            min="0"
            step="1"
          />
          <input
            type="number"
            placeholder="Tồn kho đến"
            value={maxStock}
            onChange={(event) => setMaxStock(event.target.value)}
            className="search-input"
            min="0"
            step="1"
          />
        </div>
      )}

      {message ? (
        <p
          style={{
            color: "#c0392b",
            marginBottom: "12px",
            fontWeight: 600,
          }}
        >
          {message}
        </p>
      ) : null}

      <div className="search-buttons">
        <button onClick={handleSearch} className="search-btn" type="button">
          Tìm kiếm
        </button>
        <button onClick={handleReset} className="reset-btn" type="button">
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
