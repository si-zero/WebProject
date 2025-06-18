import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";

import { LikedStoreProvider } from "./context/LikedStore";
import { UserProvider } from "./context/UserContext"; // ✅ UserProvider import 추가

function App() {
  return (
    <UserProvider> {/* ✅ UserProvider로 감싸기 */}
      <LikedStoreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
        </Router>
      </LikedStoreProvider>
    </UserProvider>
  );
}

export default App;
