import './ProductList.css'
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 10000,
    image: 'src/assets/page_shop.png'
  },
  {
    id: 2,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 20000,
    image: 'src/assets/page_shop.png'
  },
  {
    id: 3,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 30000,
    image: 'src/assets/page_shop.png'
  },
  {
    id: 4,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 40000,
    image: 'src/assets/page_shop.png'
  },
  {
    id: 5,
    title: '페이지 상점 스크립트',
    description: '페이지 상점 스크립입니다.',
    categories: '스크립트',
    price: 50000,
    image: 'src/assets/page_shop.png'
  },
];

const ProductList = () => {
    return (
        <>
            <div className="product-list">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p}/>
                ))}

            </div>
        </>
    );
}

export default ProductList;