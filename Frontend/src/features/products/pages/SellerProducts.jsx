import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useEffect } from 'react';
import '../style/sellerProducts.scss';
import { useNavigate } from 'react-router-dom';

function SellerProducts() {
  const { handleGetSellerProducts } = useProduct();
  const sellerProduct = useSelector((state) => state.products.sellerProducts);
  const navigate = useNavigate()
  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const products = sellerProduct || [];
  function handleAddProduct(){
    navigate('/seller/create-product')
  }

  function handleProductDetails(id){
    navigate(`/seller/products/${id}`)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-header__title">Your Products</h1>
          <p className="dashboard-header__subtitle">
            Manage and track everything you sell
          </p>
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products yet. Start by adding your first product.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const hasStock = typeof product.stock === 'number';
            const inStock = hasStock ? product.stock > 0 : true;

            return (
              <div className="product-card" key={product._id} onClick={()=>handleProductDetails(product._id)}>
                <div className="product-card__image-wrap">
                  <img
                    src={product.images?.[0]?.url || '/placeholder.png'}
                    alt={product.title}
                    className="product-card__image"
                  />

                  {hasStock && (
                    <span
                      className={`product-card__stock ${
                        inStock ? 'in-stock' : 'out-stock'
                      }`}
                    >
                      {inStock ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  )}

                  <div className="product-card__actions">
                    <button className="product-card__action-btn" aria-label="Edit product">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="product-card__action-btn product-card__action-btn--danger" aria-label="Delete product">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="product-card__body">
                  {product.category && (
                    <span className="product-card__category">
                      {product.category}
                    </span>
                  )}
                  <h3 className="product-card__name">{product.title}</h3>
                  <p className="product-card__price">
                    {product.price?.currency === 'INR' ? '₹' : `${product.price?.currency} `}
                    {product.price?.amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SellerProducts;