import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { handleAllProducts } = useProduct();
  const products = useSelector((state) => state.product.product) || [];
  const theme = useSelector((state) => state.theme.theme) || 'light';

  useEffect(() => {
    handleAllProducts();
  }, []);

  return (
    <div className={`home-container ${theme}`}>
      <Navbar />
      
      <div className="home-content">
        <h1 className="home-title">New Arrivals</h1>
        
        <div className="product-grid">
          {products.map((product) => (
            <div 
              key={product._id || product.id} 
              className="product-card"
              onClick={() => navigate(`/product/${product._id || product.id}`)}
            >
              <div className="product-image-container">
                <img 
                  src={product.image?.[0]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                  alt={product.title || product.name || 'Product'} 
                  className="product-image" 
                />
                <button className="like-btn" onClick={(e) => e.stopPropagation()}>
                  <CiHeart size={24} />
                </button>
                <div className="add-to-cart-container">
                  <button className="add-to-cart-btn" onClick={(e) => e.stopPropagation()}>ADD TO CART</button>
                </div>
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.title || product.name}</h3>
                <p className="product-price">₹{product.price?.amount ?? product.price}</p>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="no-products">
              <p>Loading products or no products available...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;