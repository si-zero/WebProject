import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "./SearchPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const ITEMS_PER_ROW = 6;
const ROWS_PER_PAGE = 3;
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE; // 18개
const MAX_PAGES_TO_FETCH = 5;
const MAX_ITEMS_TO_FETCH = ITEMS_PER_PAGE * MAX_PAGES_TO_FETCH; // 90개

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const searchQuery = query.get("query") || "";
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  // 1) 서버에서 최대 90개 데이터 fetch
  useEffect(() => {
    fetch(`http://localhost:3001/data/goods?limit=${MAX_ITEMS_TO_FETCH}`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.products || []);
      })
      .catch((err) => {
        console.error("상품 데이터를 불러오는 데 실패했습니다:", err);
      });
  }, []);

  // 2) searchQuery에 따른 필터링 함수
  const filterProductsBySearch = (query, products) => {
    if (!query) return products;

    // 공백(+) : 합집합, - : 차집합, & : 교집합, ""내 공백 무시
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < query.length; i++) {
      const ch = query[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        current += ch;
      } else if (!inQuotes && ch === ' ') {
        // 공백인데 따옴표 안이 아니면 skip
      } else {
        current += ch;
      }
    }

    const unionParts = current.split("+").map((part) => part.trim()).filter(Boolean);

    const getProductSet = (expr) => {
      if (expr.includes("-")) {
        const [left, right] = expr.split("-").map(e => e.trim());
        const leftSet = getProductSet(left);
        const rightSet = getProductSet(right);
        return leftSet.filter(p => !rightSet.includes(p));
      }
      if (expr.includes("&")) {
        const parts = expr.split("&").map(e => e.trim());
        let intersection = getProductSet(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          const nextSet = getProductSet(parts[i]);
          intersection = intersection.filter(p => nextSet.includes(p));
        }
        return intersection;
      }
      let term = expr;
      if (term.startsWith('"') && term.endsWith('"')) {
        term = term.slice(1, -1);
        return products.filter(p => p.name.includes(term) || p.category.includes(term));
      }
      if (term.startsWith("#")) {
        const cat = term.slice(1);
        return products.filter(p => p.category.includes(cat));
      }
      return products.filter(p => p.name.includes(term));
    };

    let resultSet = [];
    unionParts.forEach(part => {
      const partSet = getProductSet(part);
      resultSet = [...new Set([...resultSet, ...partSet])];
    });

    return resultSet;
  };

  // 3) searchQuery가 바뀌면 필터링
  useEffect(() => {
    const filtered = filterProductsBySearch(searchQuery, allProducts);
    setFilteredProducts(filtered);
    setCurrentPage(1); // 검색어 바뀌면 첫 페이지로 이동
  }, [searchQuery, allProducts]);

  // 4) 페이지 범위 보정
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // 5) 검색 결과 없으면 3초 후 이전 페이지로 이동
  useEffect(() => {
    if (filteredProducts.length === 0) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [filteredProducts.length, navigate]);

  // 6) 현재 페이지 상품 슬라이스
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  // 7) 빈 칸 채우기 (한 행은 ITEMS_PER_ROW 개)
  const placeholdersNeeded = (ITEMS_PER_ROW - (productsToShow.length % ITEMS_PER_ROW)) % ITEMS_PER_ROW;
  const totalProducts = [...productsToShow];
  for (let i = 0; i < placeholdersNeeded; i++) {
    totalProducts.push({ id: `placeholder-${i}`, placeholder: true });
  }

  return (
    <div className="search-page-container">
      <Header />
      <SearchBar />
      <h2>검색 결과: {searchQuery}</h2>

      {filteredProducts.length === 0 ? (
        <p className="no-results-message">검색 결과가 없습니다. 이전 화면으로 돌아갑니다...</p>
      ) : (
        <>
          <div className="product-grid">
            {totalProducts.map((product) =>
              product.placeholder ? (
                <ProductCard key={product.id} placeholder />
              ) : (
                <ProductCard key={product.id} product={product} />
              )
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage - 1}
              pageCount={totalPages}
              onPageChange={(page) => setCurrentPage(page + 1)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
