import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetailPage.css";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard"; 
import goods from "../data/goods.json";  // 직접 JSON import

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [relatedProducts, setRelatedProducts] = useState([]);

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

    // goods.json에서 전체 상품 목록 가져옴
    const allProducts = goods.products || [];

    // 같은 카테고리 상품 중 현재 상품 제외
    if (product.category) {
      const filtered = allProducts.filter(
        (p) => p.category === product.category && p.id !== product.id
      );
      const samples = getRandomSamples(filtered, 4);
      setRelatedProducts(samples);
    }
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    alert(`${product.name} 장바구니에 추가되었습니다.`);
    // TODO: 실제 장바구니 로직 연결
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
            <p className="product-price">{product.price.toLocaleString()}원</p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              장바구니에 담기
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
