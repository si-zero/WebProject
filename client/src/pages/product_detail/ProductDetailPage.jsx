import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";
import Header from "../../components/Header";
import ProductCard from "../home/ProductCard";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  // product 없을 경우 홈으로
  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  // product 없으면 아무것도 렌더링하지 않음
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // 썸네일 이미지 목록 생성
  const getAdditionalImages = () => {
    if (!product.image || !product.picnum) return [];

    const match = product.image.match(/(.*)(\.[\w\d_-]+)$/i);
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

  // 랜덤 연관 상품 추출
  const getRandomSamples = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // 연관 상품 불러오기
  useEffect(() => {
    fetch("http://localhost:3001/data/goods")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        if (product.categories) {
          const filtered = allProducts.filter(
            (p) => p.categories === product.categories && p.id !== product.id
          );
          const samples = getRandomSamples(filtered, 5);
          setRelatedProducts(samples);
        }
      })
      .catch((error) => {
        console.error("상품 데이터를 불러오는 데 실패했습니다:", error);
      });
  }, [product]);

  const handleBuyNow = () => {
    alert(`${product.title} 바로 구매하기 기능은 준비 중입니다.`);
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
      <div className='logo'></div>
      <div className="product-detail-container">
        <h3 style={{ fontSize: "30px" }}>{product.title}</h3>

        <div className="product-main-section">
          <div className="product-image-gallery">
            <img src={selectedImage} alt="선택된 이미지" className="main-image" />
            <div className="thumbnail-list">
              {[product.image, ...additionalImages].map((img, index) => (
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
              카테고리: {product.categories || "정보 없음"}
            </p>
            <p className="product-developer" style={{ marginBottom: "8px" }}>
              개발자: {product.developer || "정보 없음"}
            </p>
            <p className="product-price">{product.price.toLocaleString()}원</p>

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