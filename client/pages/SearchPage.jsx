import React, { useState, useEffect } from "react"; /* [1] React, useState, useEffect 임포트 */
import ProductCard from "../components/ProductCard"; /* [2] 상품 카드 컴포넌트 */
import Header from "../components/Header"; /* [3] 헤더 컴포넌트 */
import SearchBar from "../components/SearchBar"; /* [4] 검색바 컴포넌트 */
import Pagination from "../components/Pagination"; /* [5] 페이지네이션 컴포넌트 */
import "./SearchPage.css"; /* [6] CSS 스타일 */
import { useLocation, useNavigate } from "react-router-dom"; /* [7] 라우터 훅 */

const ITEMS_PER_ROW = 6; /* [8] 한 줄에 보여줄 상품 개수 */
const ROWS_PER_PAGE = 3; /* [9] 한 페이지에 보여줄 행 수 */
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE; /* [10] 한 페이지에 보여줄 총 상품 수 (18개) */
const MAX_PAGES_TO_FETCH = 5; /* [11] 서버에서 최대 5페이지 분량 데이터를 가져옴 */
const MAX_ITEMS_TO_FETCH = ITEMS_PER_PAGE * MAX_PAGES_TO_FETCH; /* [12] 최대 90개 아이템 가져오기 */

function useQuery() {
  /**
   * [13] URL 쿼리 파라미터를 쉽게 파싱하기 위한 커스텀 훅
   * react-router useLocation() 훅을 이용해 현재 URL의 쿼리스트링을 반환
   */
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  /**
   * [14] URL 쿼리에서 'query' 키를 받아옴, 없으면 빈 문자열
   * [15] useNavigate로 페이지 이동 함수 획득
   */
  const query = useQuery();
  const searchQuery = query.get("query") || "";
  const navigate = useNavigate();

  /**
   * [16] 상태 변수 선언
   * allProducts: 서버에서 받아온 전체 상품 목록
   * filteredProducts: 검색어로 필터링된 상품 목록
   * currentPage: 현재 페이지 번호 (1부터 시작)
   */
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * [17] 컴포넌트 최초 마운트 시 서버에서 최대 90개 상품 데이터 fetch
   * 서버 주소와 limit 쿼리 파라미터를 사용
   * 에러 발생 시 콘솔에 출력
   */
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

  /**
   * [18] 검색어에 따른 상품 필터링 함수
   * 특수문자 해석:
   *   + (union, 합집합)
   *   - (difference, 차집합)
   *   & (intersection, 교집합)
   *   "" (따옴표 내부는 공백 무시)
   *   # (카테고리 검색)
   * 모든 조건을 파싱해 해당 조건에 맞는 상품만 필터링하여 반환
   */
  const filterProductsBySearch = (query, products) => {
    if (!query) return products;

    let current = "";
    let inQuotes = false;
    for (let i = 0; i < query.length; i++) {
      const ch = query[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        current += ch;
      } else if (!inQuotes && ch === ' ') {
        // 따옴표 밖 공백 무시
      } else {
        current += ch;
      }
    }

    // +로 분리하여 union 처리할 부분들 분할
    const unionParts = current.split("+").map((part) => part.trim()).filter(Boolean);

    // 개별 조건을 재귀적으로 처리하는 함수
    const getProductSet = (expr) => {
      if (expr.includes("-")) {
        // 차집합 처리
        const [left, right] = expr.split("-").map(e => e.trim());
        const leftSet = getProductSet(left);
        const rightSet = getProductSet(right);
        return leftSet.filter(p => !rightSet.includes(p));
      }
      if (expr.includes("&")) {
        // 교집합 처리
        const parts = expr.split("&").map(e => e.trim());
        let intersection = getProductSet(parts[0]);
        for (let i = 1; i < parts.length; i++) {
          const nextSet = getProductSet(parts[i]);
          intersection = intersection.filter(p => nextSet.includes(p));
        }
        return intersection;
      }
      // 따옴표로 감싸인 정확한 문자열 검색
      let term = expr;
      if (term.startsWith('"') && term.endsWith('"')) {
        term = term.slice(1, -1);
        return products.filter(p => p.name.includes(term) || p.category.includes(term));
      }
      // # 카테고리 검색
      if (term.startsWith("#")) {
        const cat = term.slice(1);
        return products.filter(p => p.category.includes(cat));
      }
      // 기본: 이름에 포함되는지 여부
      return products.filter(p => p.name.includes(term));
    };

    // unionParts 각각의 조건을 집합으로 구해 합집합 연산
    let resultSet = [];
    unionParts.forEach(part => {
      const partSet = getProductSet(part);
      resultSet = [...new Set([...resultSet, ...partSet])];
    });

    return resultSet;
  };

  /**
   * [19] 검색어 혹은 전체 상품 배열이 바뀔 때마다 필터링을 다시 실행하고
   * 검색어가 바뀌면 페이지를 1로 초기화
   */
  useEffect(() => {
    const filtered = filterProductsBySearch(searchQuery, allProducts);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, allProducts]);

  /**
   * [20] 전체 필터된 상품 수에 따라 총 페이지 수 계산
   * 최소 1페이지는 보장
   */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  /**
   * [21] 현재 페이지가 범위를 벗어나면 자동 보정
   */
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  /**
   * [22] 필터 결과가 없으면 3초 뒤 이전 페이지로 자동 이동
   * 타이머 해제 클린업 포함
   */
  useEffect(() => {
    if (filteredProducts.length === 0) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [filteredProducts.length, navigate]);

  /**
   * [23] 현재 페이지에 보여줄 상품들을 배열에서 슬라이스해서 가져옴
   */
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  /**
   * [24] 한 행을 꽉 채우지 못할 경우 빈 칸 채우기 위해 placeholder 객체 생성
   * UI 그리드 정렬 깨짐 방지 목적
   */
  const placeholdersNeeded = (ITEMS_PER_ROW - (productsToShow.length % ITEMS_PER_ROW)) % ITEMS_PER_ROW;
  const totalProducts = [...productsToShow];
  for (let i = 0; i < placeholdersNeeded; i++) {
    totalProducts.push({ id: `placeholder-${i}`, placeholder: true });
  }

  /**
   * [25] 렌더링 부분
   * Header, SearchBar, 검색 결과 수 표시, 상품 목록, 페이지네이션 순서
   * 결과 없으면 안내 메시지 출력 후 자동 뒤로 가기 처리
   */
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
