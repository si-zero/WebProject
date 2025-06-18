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
  /**  
   * 현재 라우터 상태와 내비게이션 함수를 가져옵니다.  
   * location.state를 통해 이전 페이지에서 넘긴 product 데이터를 받습니다.  
   */
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  /**  
   * 선택된 이미지를 상태로 관리합니다. 초기값은 product의 기본 이미지 URL입니다.  
   * 연관 상품 목록을 상태로 관리합니다.  
   */
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /**  
   * 커스텀 훅 useLikedStore를 이용해 찜 상태 관리 및 토글 함수를 가져옵니다.  
   * 현재 상품이 찜 목록에 있는지 확인하여 isLiked 변수에 저장합니다.  
   */
  const { likedIds, toggleLike } = useLikedStore();
  const isLiked = product ? likedIds.includes(product.id) : false;

  /**  
   * product.picnum 값에 따라 추가 이미지 URL 배열을 만듭니다.  
   * 기본 이미지 경로에서 확장자 전까지를 분리하여, 숫자가 붙은 이미지들을 생성합니다.  
   * 예) image.jpg → image_1.jpg, image_2.jpg ...  
   */
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

  /** 추가 이미지 URL 리스트 */
  const additionalImages = getAdditionalImages();

  /**  
   * 상품 데이터가 없으면 홈으로 리다이렉트 처리합니다.  
   * 상품이 있을 경우, 서버 API를 호출해 같은 카테고리의 연관 상품을 불러옵니다.  
   * 현재 상품은 서버 API 요청 시 제외되어, 추가 필터링이 필요 없습니다.  
   * 에러 발생 시 빈 배열로 초기화합니다.  
   */
  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }

    fetch(
      `http://localhost:3001/api/products-by-category?category=${encodeURIComponent(
        product.category
      )}&count=5&id=${encodeURIComponent(product.id)}`
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

  /** product 정보가 없으면 화면을 렌더링하지 않고 null 반환 */
  if (!product) return null;

  /**  
   * 찜 버튼 클릭 시 호출되는 함수로, 찜 상태를 토글합니다.  
   */
  const handleAddToWishlist = () => {
    toggleLike(product.id);
  };

  /**  
   * 바로 구매 버튼 클릭 시 호출되는 함수로, 현재는 알림창만 표시합니다.  
   */
  const handleBuyNow = () => {
    alert(`${product.name} 바로 구매하기 기능은 준비 중입니다.`);
  };

  /**  
   * 취소 버튼 클릭 시 호출되는 함수로, 이전 페이지가 검색 페이지면 뒤로 가기, 아니면 홈으로 이동합니다.  
   */
  const handleCancel = () => {
    if (document.referrer.includes("/search")) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  /**  
   * JSX 렌더링: 헤더, 검색바, 상품 상세 이미지, 구매/찜 버튼, 상품 설명, 연관 상품 영역으로 구성  
   */
  return (
    <>
      <Header />
      <SearchBar />
      <div className="product-detail-container">
        <h3 style={{ fontSize: "30px" }}>{product.name}</h3>

        <div className="product-main-section">
          <div className="product-image-gallery">
            {/* 선택된 이미지 크게 표시 */}
            <img
              src={selectedImage}
              alt="선택된 이미지"
              className="main-image"
            />
            {/* 썸네일 목록: 기본 이미지 + 추가 이미지 */}
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
                    e.target.style.display = "none"; // 이미지 로드 실패 시 숨김 처리
                  }}
                />
              ))}
            </div>
          </div>

          <div className="product-purchase-section">
            {/* 카테고리, 개발자, 가격 정보 출력 */}
            <p className="product-category" style={{ marginBottom: "8px" }}>
              카테고리: {product.category || "정보 없음"}
            </p>
            <p className="product-developer" style={{ marginBottom: "8px" }}>
              개발자: {product.developer || "정보 없음"}
            </p>
            <p className="product-price">{product.price.toLocaleString()}원</p>

            {/* 찜 상태에 따라 버튼 텍스트 변경 */}
            <button className="add-to-wishlist-button" onClick={handleAddToWishlist}>
              {isLiked ? "찜 해제" : "찜 하기"}
            </button>

            {/* 바로 구매 버튼 */}
            <button className="buy-now-button" onClick={handleBuyNow}>
              바로 구매하기
            </button>

            {/* 취소 버튼 */}
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
        </div>

        {/* 상품 설명 영역 */}
        <div className="product-description-section">
          <h3>상품 설명</h3>
          <p>{product.description}</p>
        </div>

        {/* 연관 상품 영역 */}
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
