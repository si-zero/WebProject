// src/pages/WishlistPage.jsx
import React, { useEffect, useState } from "react";
import "./WishlistPage.css"; // 스타일 파일 추가

const WishlistPage = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
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
              <img src={product.imageUrl} alt={product.name} className="wishlist-image" />
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
  );
};

export default WishlistPage;
