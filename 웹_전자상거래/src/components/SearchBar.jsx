import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
