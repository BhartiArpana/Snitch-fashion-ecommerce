import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts) || [];
  const theme = useSelector((state) => state.theme.theme) || 'light';

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  return (
    <div className={`dashboard-container ${theme}`}>
      <Navbar />
      
      <div className="dashboard-content">
        <h1 className="dashboard-title">Your Products</h1>
        
        <div className="product-grid">
          {sellerProducts.map((product) => (
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
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.title || product.name}</h3>
                <p className="product-price">₹{product.price?.amount ?? product.price}</p>
              </div>
            </div>
          ))}
          
          {sellerProducts.length === 0 && (
            <div className="no-products">
              <p>You haven't uploaded any products yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;