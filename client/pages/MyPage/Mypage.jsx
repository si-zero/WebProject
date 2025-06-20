import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import OrderHistory from "./OrderHistory";
import AccountEdit from "./AccountEdit";
import AccountDelete from "./AccountDelete";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import "./MyPage.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("shopping");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ProductInfo":
        return <ProductInfo />;
      case "OrderHistory":
        return <OrderHistory />;
      case "AccountEdit":
        return <AccountEdit />;
      case "AccountDelete":
        return <AccountDelete />;
      default:
        return <div>존재하지 않는 탭입니다.</div>;
    }
  };

  return (
    <>
      <Header />
      <SearchBar />
      <div className="mypage-container">
        <h1 className="mypage-title">마이페이지</h1>
        <div className="mypage-tabs">
          <button onClick={() => setActiveTab("OrderHistory")}>주문내역</button>
          <button onClick={() => setActiveTab("ProductInfo")}>상품관리</button>
          <button onClick={() => setActiveTab("AccountEdit")}>회원정보</button>
          <button onClick={() => setActiveTab("AccountDelete")}>회원탈퇴</button>
        </div>
        <div className="mypage-content">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default MyPage;
