import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "./SearchPage.css";
import data from "../data/goods.json";
import { useLocation, useNavigate } from "react-router-dom";

const ITEMS_PER_ROW = 6;
const ROWS_PER_PAGE = 3;
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE; // 18개

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const searchQuery = query.get("query") || "";
  const navigate = useNavigate();

  // 검색어를 파싱하여 조건별 필터링 수행
  // 공백(+) : 합집합, - : 차집합, & : 교집합, ""내 공백 무시
  const filterProductsBySearch = (query) => {
    if (!query) return [];

    // 쿼리 내 " " 로 묶인 부분은 그대로 유지하고 나머지 공백 제거
    // 예: q & d -> q&d (공백 제거)
    //     "q d" -> "q d" (그대로)
    // eslint-disable-next-line no-unused-vars
    const tokens = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < query.length; i++) {
      const ch = query[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        current += ch;
      } else if (!inQuotes && ch === ' ') {
        // 공백인데 따옴표 안이 아니면 skip (공백 제거)
      } else {
        current += ch;
      }
    }
    // current는 공백 제거된 전체 쿼리, 따옴표 포함

    // 각 조건으로 쿼리를 분할하기 위해 + 연산자를 우선으로 split
    const unionParts = current.split("+").map(part => part.trim()).filter(Boolean);

    // 조건별로 제품 ID 배열을 구하는 재귀 함수
    // (최종적으로 unionParts에 대해 각각 diff 연산 수행 후 합집합)
    const getProductSet = (expr) => {
      // 차집합(a-b)
      if (expr.includes("-")) {
        const [left, right] = expr.split("-").map(e => e.trim());
        const leftSet = getProductSet(left);
        const rightSet = getProductSet(right);
        return leftSet.filter(p => !rightSet.includes(p));
      }
      // 교집합(a&b)
      if (expr.includes("&")) {
        const parts = expr.split("&").map(e => e.trim());
        let intersection = getProductSet(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          const nextSet = getProductSet(parts[i]);
          intersection = intersection.filter(p => nextSet.includes(p));
        }
        return intersection;
      }
      // 단일 조건 (따옴표 문자열 또는 해시태그, 이름 포함)
      let term = expr;
      if (term.startsWith('"') && term.endsWith('"')) {
        // 따옴표 제거하고 공백 포함 검색어로 처리
        term = term.slice(1, -1);
        return data.products.filter(p =>
          p.name.includes(term) || p.category.includes(term)
        );
      }
      // 해시태그(#category)
      if (term.startsWith("#")) {
        const cat = term.slice(1);
        return data.products.filter(p => p.category.includes(cat));
      }
      // 일반 단어 이름 검색
      return data.products.filter(p => p.name.includes(term));
    };

    // unionParts 각각에 대해 getProductSet를 실행 후 합집합
    let resultSet = [];
    unionParts.forEach(part => {
      const partSet = getProductSet(part);
      resultSet = [...new Set([...resultSet, ...partSet])];
    });

    return resultSet;
  };

  const filteredProducts = filterProductsBySearch(searchQuery);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 검색 결과 없을 경우 3초 후 이전 페이지로 이동
  useEffect(() => {
    if (filteredProducts.length === 0) {
      const timer = setTimeout(() => {
        navigate(-1); // 이전 페이지로 이동
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [filteredProducts.length, navigate]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

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
        <p className="no-results-message">
          검색 결과가 없습니다. 이전 화면으로 돌아갑니다...
        </p>
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
