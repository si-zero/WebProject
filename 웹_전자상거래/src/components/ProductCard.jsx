import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import "./ProductCard.css";

const ProductCard = ({ product, placeholder = false }) => {
  const [liked, setLiked] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [buttonsActive, setButtonsActive] = useState(true);
  const navigate = useNavigate(); // 추가

  if (placeholder) {
    return <div className="product-card placeholder" />;
  }

  const toggleLike = (e) => {
    e.stopPropagation(); // 상위 div 클릭 이벤트 방지
    setLiked(!liked);
  };

  const handleCartClick = (e) => {
    e.stopPropagation(); // 상위 div 클릭 이벤트 방지
    // TODO: 장바구니 로직 추가 가능
  };

  const handleCardClick = () => {
    navigate("/product", { state: product });
      console.log(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <button
        className="like-button"
        onClick={toggleLike}
        style={{
          color: liked ? "#e60000" : "#888888",
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
        onClick={handleCartClick}
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
        <p className="product-name">{product.name}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{product.price.toLocaleString()}원</p>
      </div>
    </div>
  );
};

export default ProductCard;
