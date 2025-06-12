import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [buttonsActive, setButtonsActive] = useState(true); // 버튼 활성 상태

  const toggleLike = () => {
    setLiked(!liked);
    // TODO: 서버 연동 시 API 호출 위치
  };

  return (
    <div className="product-card">
      {/* 이미지 위 절대 위치 버튼 */}
      <button
        className="like-button"
        onClick={toggleLike}
        style={{
          color: liked ? "#e60000" : "#888888", // 하트 색상 변경
          opacity: buttonsActive ? 1 : 0.5,
          backgroundColor: buttonsActive ? "white" : "#f0f0f0",
          cursor: buttonsActive ? "pointer" : "default",
        }}
        aria-label="좋아요"
        disabled={!buttonsActive}
      >
        ♥
      </button>
      <button
        className="cart-button"
        aria-label="장바구니"
        style={{
          opacity: buttonsActive ? 1 : 0.5,
          backgroundColor: buttonsActive ? "white" : "#f0f0f0",
          cursor: buttonsActive ? "pointer" : "default",
        }}
        disabled={!buttonsActive}
      >
        🛒
      </button>

      <div className="image-section">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <p className="product-tag">#{product.category}</p>
        <h4 className="product-name">{product.name}</h4>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{product.price.toLocaleString()}원</p>
      </div>
    </div>
  );
};

export default ProductCard;
