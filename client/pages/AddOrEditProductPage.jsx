// AddOrEditProductPage.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddOrEditProductPage.css";

const AddOrEditProductPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product;
  const isEdit = !!editingProduct;

  const [form, setForm] = useState({
    imageUrl: "/images/default.png",
    category: "스크립트",
    name: "",
    description: "",
    price: 0,
    picnum: 5,
  });

  // 수정 모드일 경우 폼 데이터 설정
  useEffect(() => {
    if (isEdit) {
      setForm({
        imageUrl: editingProduct.imageUrl,
        category: editingProduct.category,
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        picnum: editingProduct.picnum || 5,
      });
    }
  }, [isEdit, editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "picnum" ? Number(value) : value,
    }));
  };

  // 가격 1000 단위 증감 함수
  const adjustPrice = (amount) => {
    setForm((prev) => {
      let newPrice = (prev.price || 0) + amount;
      if (newPrice < 0) newPrice = 0; // 가격 음수 방지
      return { ...prev, price: newPrice };
    });
  };

  // picnum 1 단위 증감 함수 (1 ~ 5 제한)
  const adjustPicnum = (amount) => {
    setForm((prev) => {
      let newPicnum = (prev.picnum || 5) + amount;
      if (newPicnum < 1) newPicnum = 1;
      if (newPicnum > 5) newPicnum = 5;
      return { ...prev, picnum: newPicnum };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `http://localhost:3001/api/add-product`
      : "http://localhost:3001/api/add-product";

    const method = "POST";

    const bodyData = {
      ...form,
      userId: user.id,
    };

    if (isEdit) {
      bodyData.id = editingProduct.id;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      alert(isEdit ? "상품이 수정되었습니다." : "상품이 등록되었습니다.");
      navigate("/Mypage");
    } else {
      alert("상품 저장 실패");
    }
  };

  return (
    <div className="container">
      <h2 className="title">{isEdit ? "상품 수정" : "상품 등록"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          이미지 주소:
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>
        <label>
          카테고리:
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="스크립트">스크립트</option>
            <option value="아이템">아이템</option>
            <option value="코드">코드</option>
            <option value="리소스">리소스</option>
          </select>
        </label>
        <label>
          이름:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          설명:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          가격:
          <div>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min={0}
              required
            />
            <button
              type="button"
              onClick={() => adjustPrice(1000)}
            >
              +1000
            </button>
            <button
              type="button"
              onClick={() => adjustPrice(-1000)}
            >
              -1000
            </button>
          </div>
        </label>
        <label>
          picnum:
          <div>
            <input
              type="number"
              name="picnum"
              value={form.picnum}
              onChange={handleChange}
              min={1}
              max={5}
              required
            />
            <button
              type="button"
              onClick={() => adjustPicnum(1)}
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => adjustPicnum(-1)}
            >
              -1
            </button>
          </div>
        </label>
        <button type="submit">{isEdit ? "수정 완료" : "등록"}</button>
      </form>
    </div>
  );
};

export default AddOrEditProductPage;
