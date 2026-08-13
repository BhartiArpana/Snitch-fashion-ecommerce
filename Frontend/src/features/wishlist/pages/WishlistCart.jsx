import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWishlist } from '../hook/useWishlist';
import '../styles/wishlistItem.scss';

function WishlistItem() {
  const navigate = useNavigate();
  const { handleGetWishlist, handleRemoveFromWishlist } = useWishlist();

  const wishlistData = useSelector((state) => state.wishlist.wishlist);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);

  const items = wishlistData?.[0]?.items || [];

  useEffect(() => {
    handleGetWishlist();
  }, []);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleRemoveClick = (e, productId, variantId) => {
    e.stopPropagation();
    handleRemoveFromWishlist(productId, variantId);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__loading">Loading your wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header">
        <h1 className="wishlist-page__title">My Wishlist</h1>
        <span className="wishlist-page__count">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="wishlist-page__empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p>Your wishlist is empty</p>
          <button onClick={() => navigate('/')} className="wishlist-page__shop-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-page__grid">
          {items.map((item) => (
            <div
              key={item._id}
              className="wishlist-card"
              onClick={() => handleCardClick(item.product?._id)}
            >
              <div className="wishlist-card__image-wrap">
                <img
                  src={item.product?.images?.[0] || '/placeholder.png'}
                  alt={item.product?.name || 'Product'}
                  className="wishlist-card__image"
                />
                <button
                  className="wishlist-card__remove-btn"
                  aria-label="Remove from wishlist"
                  onClick={(e) => handleRemoveClick(e, item.product?._id, item.variants?._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="wishlist-card__info">
                <h3 className="wishlist-card__name">{item.product?.name || 'Product name'}</h3>
                {item.variants?.attributes && (
                  <p className="wishlist-card__variant">
                    {Object.values(item.variants.attributes).join(' / ')}
                  </p>
                )}
                <p className="wishlist-card__price">₹{item.variants?.price ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistItem;