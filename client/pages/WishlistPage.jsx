import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { useLoading } from "../context/LoadingContext";
import { useLikedStore } from "../context/LikedStore";
import LikedProductCard from "../components/LikedProductCard"; // 💡 새로 추가
import "./WishlistPage.css";

const WishlistPage = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const { likedIds, toggleLike } = useLikedStore();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (likedIds.length === 0) {
        setLikedProducts([]);
        return;
      }

      try {
        startLoading();
        const res = await fetch("http://localhost:3001/api/liked-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likedIds }),
        });

        const data = await res.json();
        setLikedProducts(data);
      } catch (error) {
        console.error("찜 목록 불러오기 실패:", error);
      } finally {
        stopLoading();
      }
    };

    fetchLikedProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedIds]);

  return (
    <>
      <Header />
      <SearchBar />
      <div className="wishlist-page">
        <h2 className="wishlist-title">찜한 상품 목록</h2>
        {likedIds.length === 0 ? (
          <p>찜한 상품이 없습니다.</p>
        ) : (
          <div className="wishlist-list">
            {likedProducts.map((product) => (
              <LikedProductCard
                key={product.id}
                product={product}
                onToggleLike={toggleLike}
                onPurchase={(p) => console.log("구매하기 클릭됨:", p)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
