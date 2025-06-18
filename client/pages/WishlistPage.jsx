import React, { useEffect, useState } from "react"; 
/** [1] React, useEffect와 useState 훅 임포트 */

import Header from "../components/Header";        
/** [2] 페이지 상단에 표시할 헤더 컴포넌트 */

import SearchBar from "../components/SearchBar";  
/** [3] 검색 입력 기능을 위한 검색바 컴포넌트 */

import "./WishlistPage.css";
/** [4] 위시리스트 페이지 전용 CSS 스타일 */

const WishlistPage = () => {
  /**
   * [5] likedProducts: 찜한 상품 목록 상태 변수, 초기값 빈 배열
   * loading: 데이터 로딩 상태 관리용, 초기값 true
   */
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * [6] 컴포넌트가 처음 렌더링될 때 실행되는 useEffect
   * 찜한 상품 데이터를 서버 API('http://localhost:3001/api/liked-products')에서 fetch
   * 성공 시 likedProducts 상태에 저장, loading false로 변경
   * 실패 시 에러 콘솔 출력 후 loading false로 변경
   * 빈 의존성 배열로 한 번만 실행됨
   */
  useEffect(() => {
    fetch("http://localhost:3001/api/liked-products")
      .then((res) => res.json())
      .then((data) => {
        setLikedProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("찜한 상품 데이터를 불러오는 데 실패했습니다:", error);
        setLoading(false);
      });
  }, []);

  /**
   * [7] JSX 렌더링
   * - Header와 SearchBar 컴포넌트 포함
   * - 로딩 중이면 '로딩 중...' 메시지 출력
   * - 찜한 상품이 없으면 '찜한 상품이 없습니다.' 메시지 출력
   * - 찜한 상품이 있으면 목록을 카드 형식으로 보여줌
   *   각 상품은 이미지, 이름, 설명, 가격, 장바구니 담기 버튼 포함
   */
  return (
    <>
      <Header />
      <SearchBar />
      <div className="wishlist-page">
        <h2 className="wishlist-title">찜한 상품 목록</h2>

        {loading ? (
          <p>로딩 중...</p>
        ) : likedProducts.length === 0 ? (
          <p>찜한 상품이 없습니다.</p>
        ) : (
          <div className="wishlist-list">
            {likedProducts.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="wishlist-image"
                />
                <div className="wishlist-info">
                  <h3>{product.name}</h3>
                  <p className="wishlist-description">{product.description}</p>
                </div>
                <div className="wishlist-actions">
                  <span className="wishlist-price">{product.price}원</span>
                  <button className="wishlist-button">장바구니 담기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
/** [8] 컴포넌트 기본 export */
