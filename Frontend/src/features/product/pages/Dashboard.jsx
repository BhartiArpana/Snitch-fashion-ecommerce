import React, { useEffect } from 'react'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux'
import '../styles/dashboard.css'

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct()
  const sellerProducts = useSelector(state => state.product.sellerProducts)

  useEffect(() => {
    handleGetSellerProduct()
  }, [])

  return (
    <div className="dashboard">

      <div className="product-grid">
        {sellerProducts?.map((item) => (
          <div key={item._id} className="product-card">

            {/* Wishlist */}
            <div className="wishlist">♡</div>

            {/* Image */}
            <div className="image-box">
              <img
                src={item.image?.[0]?.url || 'https://via.placeholder.com/300'}
                alt={item.title}
              />
            </div>

            {/* Info */}
            <div className="product-info">
              <p className="title">{item.title}</p>
              <p className="price">₹{item.price?.amount}</p>

              
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Dashboard