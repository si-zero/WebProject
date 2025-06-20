// components/LikedProductCard.jsx
import React from "react";
import "./LikedProductCard.css";

const LikedProductCard = ({
  product,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = "구매하기",
  secondaryLabel = "찜 해제"
}) => {
  return (
    <div className="wishlist-item">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="wishlist-image"
      />
      <div className="wishlist-info">
        <h3>{product.name}</h3>
        <p className="wishlist-description">{product.description}</p>
        <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
          인기도: 1234 | 등록일자: 2023-01-01
        </p>
        <p className="wishlist-price">
          {product.price.toLocaleString()}원
        </p>
      </div>
      <div className="wishlist-actions">
        <button className="wishlist-button" onClick={() => onPrimaryClick?.(product)}>
          {primaryLabel}
        </button>
        <button
          className="wishlist-button"
          onClick={() => onSecondaryClick?.(product)}
          style={{ marginTop: "8px" }}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
};

export default LikedProductCard;
