import { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import '../style/landingPage.scss';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const { handleAllProducts } = useProduct();
  const products = useSelector((state) => state.products.products) || [];
  const isLoading = useSelector((state) => state.products.loading);
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate()
  const [variantId,setVariantID] = useState(null)

 
  useEffect(() => {
    handleAllProducts();
  }, []);

  function handleAddToCard(){
    if(!user){
        navigate('/login')
    }
    
  }

  function handleDetailsCard(id){
    navigate(`/products/${id}`)
  }

  return (
    <div className="landing-page">
      {/* Hero Banner */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-hero__tag">SUMMER COLLECTION 2026</span>
          <h1 className="landing-hero__title">REDEFINE YOUR STYLE</h1>
          <p className="landing-hero__subtitle">
            Minimalist essentials designed for the modern individual. Crafted with precision, styled for comfort.
          </p>
          <button className="landing-hero__btn">SHOP THE DROP</button>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="landing-categories">
        <span className="landing-categories__title">BROWSE BY CATEGORY</span>
        <div className="landing-categories__list">
          <button className="landing-categories__item active">All</button>
          <button className="landing-categories__item">New Arrivals</button>
          <button className="landing-categories__item">T-Shirts</button>
          <button className="landing-categories__item">Shirts</button>
          <button className="landing-categories__item">Accessories</button>
        </div>
      </section>

      {/* Product Catalog section */}
      <section className="landing-catalog">
        <div className="landing-catalog__header">
          <h2 className="landing-catalog__title">Featured Arrivals</h2>
          <span className="landing-catalog__count">{products.length} Products</span>
        </div>

        {isLoading ? (
          /* Shimmer loading placeholders */
          <div className="landing-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="shimmer-card" key={n}>
                <div className="shimmer-card__image animate-shimmer"></div>
                <div className="shimmer-card__title animate-shimmer"></div>
                <div className="shimmer-card__price animate-shimmer"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="landing-catalog__empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
            <p>No products available right now. Please check back later!</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="landing-grid">
            {products.map((product) => {
              const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
              return (
                <div className="landing-card" key={product._id} onClick={()=>handleDetailsCard(product._id)}>
                  <div className="landing-card__media">
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="landing-card__img"
                      loading="lazy"
                    />
                    <div className="landing-card__overlay">
                      <button className="landing-card__action-btn" onClick={handleAddToCard}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="landing-card__body">
                    {product.category && (
                      <span className="landing-card__category">{product.category}</span>
                    )}
                    <h3 className="landing-card__title">{product.title}</h3>
                    <p className="landing-card__price">
                      {product.price?.currency === 'INR' ? '₹' : `${product.price?.currency} `}
                      {product.price?.amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default LandingPage;