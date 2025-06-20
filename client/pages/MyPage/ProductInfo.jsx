import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import LikedProductCard from "../../components/LikedProductCard";
import { useNavigate } from "react-router-dom";

const ProductInfo = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProducts = async () => {
      const res = await fetch("http://localhost:3001/api/user-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      setProducts(data);
    };

    fetchUserProducts();
  }, [user]);

  // 상품 수정 페이지로 상품 객체(state) 전달
  const handleEdit = (product) => {
    navigate("/edit-product", { state: { product } });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`'${product.name}' 상품을 삭제하시겠습니까?`)) return;

    const res = await fetch(`http://localhost:3001/api/delete-product/${product.id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      alert("삭제 실패");
    }
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  return (
    <div className="wishlist-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="wishlist-title">내가 등록한 상품</h2>
        <button onClick={handleAddProduct} style={{ padding: "8px 12px", fontSize: "14px" }}>
          상품 등록
        </button>
      </div>
      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <div className="wishlist-list">
          {products.map(product => (
            <LikedProductCard
              key={product.id}
              product={product}
              onPrimaryClick={handleEdit}
              onSecondaryClick={handleDelete}
              primaryLabel="상품 수정"
              secondaryLabel="상품 삭제"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
