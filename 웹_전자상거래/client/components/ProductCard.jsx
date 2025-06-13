// client/components/ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLikedStore } from "../context/LikedStore"; // context 연결
import "./ProductCard.css";

const ProductCard = ({ product, placeholder = false }) => {
  const navigate = useNavigate();
  const { likedIds, toggleLike } = useLikedStore();

  // product가 없거나 placeholder면 플레이스홀더 렌더링
  if (placeholder || !product) {
    return <div className="product-card placeholder" />;
  }

  const isLiked = likedIds.includes(product.id);

  const handleCardClick = () => {
    navigate("/product", { state: product });
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(product.id);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    // 장바구니 로직 (기존 유지)
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <button
        className="like-button"
        onClick={handleLikeClick}
        style={{
          color: isLiked ? "#e60000" : "#888888",
          backgroundColor: "white",
        }}
        aria-label="좋아요"
      >
        ♥
      </button>
      <button
        className="cart-button"
        onClick={handleCartClick}
        aria-label="장바구니"
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
