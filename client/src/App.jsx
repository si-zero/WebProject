// App.jsx ✅ 수정된 버전
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ProductDetailPage from './pages/product_detail/ProductDetailPage';
import Register from './pages/login/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;