import './ProductList.css'
import ProductCard from "./ProductCard";
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 10000,
    image: '/page_shop.png',
    picnum: 3,
    developer: 'user1'
  },
  {
    id: 2,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 20000,
    image: '/page_shop.png',
    picnum: 3,
    developer: 'user1'
  },
  {
    id: 3,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 30000,
    image: '/page_shop.png',
    picnum: 3,
    developer: 'user1'
  },
  {
    id: 4,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 40000,
    image: '/page_shop.png',
    picnum: 3,
    developer: 'user1'
  },
  {
    id: 5,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 50000,
    image: '/page_shop.png',
    picnum: 3,
    developer: 'user1'
  },
];

const ProductList = () => {
  const navigate = useNavigate();

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };
  
  return (
      <>
          <div className="product-list">
              {products.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={() => handleCardClick(p)}/>
              ))}

          </div>
      </>
  );
}

export default ProductList;