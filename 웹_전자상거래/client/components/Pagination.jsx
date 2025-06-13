// Pagination.jsx
import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  const totalButtons = 5;
  const half = Math.floor(totalButtons / 2);

  let start = Math.max(0, currentPage - half);
  let end = Math.min(pageCount - 1, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(pageCount - 1, totalButtons - 1);
  }
  if (currentPage + half >= pageCount - 1) {
    start = Math.max(0, pageCount - totalButtons);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(
      <button
        key={i}
        className={`page-number-button ${i === currentPage ? "active" : ""}`}
        onClick={() => onPageChange(i)}
        aria-label={`${i + 1} 페이지로 이동`}
      >
        {i + 1}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button
        className="page-nav-button"
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        aria-label="처음 페이지로 이동"
      >
        &laquo;
      </button>

      {pages}

      <button
        className="page-nav-button"
        onClick={() => onPageChange(pageCount - 1)}
        disabled={currentPage === pageCount - 1}
        aria-label="마지막 페이지로 이동"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
