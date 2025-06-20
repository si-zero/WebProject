import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { useLikedStore } from "../context/LikedStore";

/**  
 * ProductDetailPage 컴포넌트는 상품 상세 정보와 관련 기능(찜, 구매, 연관상품)을 담당합니다.  
 */
const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { likedIds, toggleLike } = useLikedStore();
  const isLiked = product ? likedIds.includes(product.id) : false;

  const getAdditionalImages = () => {
    if (!product || !product.picnum) return [];

    const match = product.imageUrl.match(/(.*)(\.[\w\d_-]+)$/i);
    if (!match) return [];

    const baseUrl = match[1];
    const ext = match[2];

    const images = [];
    for (let i = 1; i <= product.picnum; i++) {
      images.push(`${baseUrl}_${i}${ext}`);
    }
    return images;
  };

  const additionalImages = getAdditionalImages();

  useEffect(() => {
    // ✅ 페이지 진입 시 스크롤 최상단으로 이동
    window.scrollTo(0, 0);

    if (!product) {
      navigate("/");
      return;
    }

    fetch(
      `http://localhost:3001/api/products-by-category?category=${encodeURIComponent(
        product.category
      )}&count=4&id=${encodeURIComponent(product.id)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const products = data.products || [];
        setRelatedProducts(products);
      })
      .catch((error) => {
        console.error("연관 상품 데이터를 불러오는 데 실패했습니다:", error);
        setRelatedProducts([]);
      });
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToWishlist = () => {
    toggleLike(product.id);
  };

  const handleBuyNow = () => {
    alert(`${product.name} 바로 구매하기 기능은 준비 중입니다.`);
  };

  const handleCancel = () => {
    if (document.referrer.includes("/search")) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Header />
      <SearchBar />
      <div className="product-detail-container">
        <h3 style={{ fontSize: "30px" }}>{product.name}</h3>

        <div className="product-main-section">
          <div className="product-image-gallery">
            <img
              src={selectedImage}
              alt="선택된 이미지"
              className="main-image"
            />
            <div className="thumbnail-list">
              {[product.imageUrl, ...additionalImages].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`썸네일 ${index + 1}`}
                  className={`thumbnail ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ))}
            </div>
          </div>

          <div className="product-purchase-section">
            <p className="product-category" style={{ marginBottom: "8px" }}>
              카테고리: {product.category || "정보 없음"}
            </p>
            <p className="product-developer" style={{ marginBottom: "8px" }}>
              개발자: {product.developer || "정보 없음"}
            </p>
            <p className="product-price">{product.price.toLocaleString()}원</p>

            <button className="add-to-wishlist-button" onClick={handleAddToWishlist}>
              {isLiked ? "찜 해제" : "찜 하기"}
            </button>

            <button className="buy-now-button" onClick={handleBuyNow}>
              바로 구매하기
            </button>

            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
        </div>

        <div className="product-description-section">
          <h3>상품 설명</h3>
          <p>{product.description}</p>
        </div>

        <div className="related-products-section">
          <h3>연관 상품</h3>
          <div className="related-products-grid">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))
            ) : (
              <p>연관 상품이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
