import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hook/useWishlist';
import { useCart } from '../../cart/hook/useCart';
import '../styles/wishlistItem.scss';

function WishlistItem() {
  const navigate = useNavigate();
  const { handleGetWishlist, handleRemoveWishlist } = useWishlist();
  const { handleAddToCartHook } = useCart();
  const [addingId, setAddingId] = useState(null);

  const wishlistData = useSelector((state) => state.wishlist.wishlist);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);

  // Parse items from wishlist API response array structure
  const wishlistDoc = Array.isArray(wishlistData) ? wishlistData[0] : wishlistData;
  const items = wishlistDoc?.items || [];

  useEffect(() => {
    handleGetWishlist();
  }, []);

  const handleCardClick = (productId) => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const handleRemoveClick = async (e, productId, variantId) => {
    e.stopPropagation();
    if (productId && variantId) {
      await handleRemoveWishlist({ productId, variantId });
    }
  };

  const handleMoveToBag = async (e, productId, variantId) => {
    e.stopPropagation();
    if (productId && variantId) {
      setAddingId(variantId);
      await handleAddToCartHook({ productId, variantId });
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <h1 className="wishlist-page__title">WISHLIST</h1>
          <div className="wishlist-page__loading">Loading wishlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <h1 className="wishlist-page__title">WISHLIST</h1>
          <div className="wishlist-page__error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__container">
        <h1 className="wishlist-page__title">WISHLIST</h1>

        {items.length === 0 ? (
          <div className="wishlist-page__empty">
            <div className="wishlist-page__empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="wishlist-page__empty-title">Your Wishlist is Empty</h2>
            <p className="wishlist-page__empty-sub">
              Explore our latest arrivals and add your favorite styles here.
            </p>
            <button onClick={() => navigate('/')} className="wishlist-page__shop-btn" type="button">
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="wishlist-page__list">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              // Extract variant ID, variant object, image, price, attributes
              const variantId = typeof item.variants === 'string' ? item.variants : item.variants?._id || product.variants?._id;
              const variantObj = typeof product.variants === 'object' ? product.variants : null;
              const image = variantObj?.image?.[0]?.url || product.images?.[0]?.url || product.images?.[0] || 'https://ik.imagekit.io/fe1vmmkus/snitch/4MST2375-03-M1_9ec69d7a-5ca7-43e7-9d1d-752b63f05d3d__Y89OO2OD.webp';
              
              const price = variantObj?.price?.amount || product.price?.amount || 399;
              const originalPrice = Math.round(price * 1.25);
              const attributes = variantObj?.attribut || variantObj?.attributes || {};
              
              // Extract subtitle color/variant name or short description snippet
              const color = attributes.color || attributes.Color;
              const subtitle = color ? color.charAt(0).toUpperCase() + color.slice(1) : (product.description ? product.description.split(' ')[0] : 'Casual Wear');

              return (
                <div key={item._id} className="wishlist-item">
                  {/* Product Image */}
                  <div className="wishlist-item__image-wrap" onClick={() => handleCardClick(product._id)}>
                    <img src={image} alt={product.title || 'Snitch Product'} />
                  </div>

                  {/* Item Details */}
                  <div className="wishlist-item__details">
                    <div className="wishlist-item__top">
                      <div className="wishlist-item__title-group" onClick={() => handleCardClick(product._id)}>
                        <h3 className="wishlist-item__title">{product.title || 'Polo T-Shirt'}</h3>
                        <p className="wishlist-item__subtitle">{subtitle}</p>
                      </div>

                      {/* Trash Delete Icon */}
                      <button
                        className="wishlist-item__trash-btn"
                        onClick={(e) => handleRemoveClick(e, product._id, variantId)}
                        aria-label="Remove from wishlist"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="wishlist-item__bottom">
                      <button
                        className="wishlist-item__move-bag"
                        disabled={addingId === variantId}
                        onClick={(e) => handleMoveToBag(e, product._id, variantId)}
                        type="button"
                      >
                        {addingId === variantId ? 'ADDING...' : 'MOVE TO BAG'}
                      </button>

                      <div className="wishlist-item__price-box">
                        <span className="wishlist-item__original-price">₹{originalPrice}</span>
                        <span className="wishlist-item__final-price">₹{price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistItem;