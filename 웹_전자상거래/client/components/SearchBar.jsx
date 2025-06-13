import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("query") || "";

  const [input, setInput] = useState(initialQuery);

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/search?query=${encodeURIComponent(input.trim())}`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="이름, 카테고리로 검색 가능하며, + - & 연산자를 사용하여 다중 조건 검색이 가능합니다"
        className="search-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
