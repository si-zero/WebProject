import './ProductCard.css'

const ProductCard = ({product, onClick}) => {
    return (
        <>
            <div className='product-card' onClick={onClick}>
                <div className='top-box'>
                    <img src={product.image} alt={product.title} className='product-image'/>
                    <img src='/heart_deativation.png' className='product-heart'/>
                </div>
                <div className='bottom-box'>
                    <div className='top-title'>
                        <p className='product-categories'># {product.categories}</p>
                        <p className='product-title'>{product.title}</p>
                    </div>

                    <div className='bottom-title'>
                        <p className='product-price'>{product.price}원</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductCard