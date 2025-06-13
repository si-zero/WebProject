import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { useLikedStore } from "../context/LikedStore"; // 찜하기 기능 연동

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // 찜하기 상태 & 토글 함수 받아오기
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

  const getRandomSamples = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3001/data/goods")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        if (product.category) {
          const filtered = allProducts.filter(
            (p) => p.category === product.category && p.id !== product.id
          );
          const samples = getRandomSamples(filtered, 5);
          setRelatedProducts(samples);
        }
      })
      .catch((error) => {
        console.error("상품 데이터를 불러오는 데 실패했습니다:", error);
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
            <img src={selectedImage} alt="선택된 이미지" className="main-image" />
            <div className="thumbnail-list">
              {[product.imageUrl, ...additionalImages].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`썸네일 ${index + 1}`}
                  className={`thumbnail ${selectedImage === img ? "active" : ""}`}
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

            {/* 찜하기 버튼 텍스트 상태에 따라 변경 */}
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
              relatedProducts.map((prod) => <ProductCard key={prod.id} product={prod} />)
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
