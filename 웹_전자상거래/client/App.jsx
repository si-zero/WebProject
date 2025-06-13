import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { LikedStoreProvider } from "./context/LikedStore";
import WishlistPage from "./pages/WishlistPage";

function App() {
  return (
    <Router>
      <LikedStoreProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
       </LikedStoreProvider>
    </Router>
  );
}

export default App;
