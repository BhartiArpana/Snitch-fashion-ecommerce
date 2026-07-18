import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import CartItem from '../componenets/CartItem';
import '../style/addToCart.scss';
import { useNavigate } from 'react-router-dom';

function AddToCart(){
     const { handleGetCart, handleIncreaseQty, handleDecreaseQty, handleRemoveItem } = useCart();
  const cartData = useSelector((state) => state.cart.items);
  const items = cartData?.items || [];
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate()
  

  if(!user){
    navigate('/login')
  }

  useEffect(() => {
    handleGetCart();
  }, []);
    const totalAmount = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const currency = items[0]?.price?.currency || 'INR';

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <p className="cart-empty__text">Your cart is empty</p>
      </div>
    );
  }

    return (
          <div className="cart-page">
      <div className="cart-page__container">
        <div className="cart-page__list">
          <h1 className="cart-page__heading">Shopping Cart ({totalItems})</h1>
          {items.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onIncrease={() => handleIncreaseQty(item._id, item.quantity + 1)}
              onDecrease={() => handleDecreaseQty(item._id, item.quantity - 1)}
              onRemove={() => handleRemoveItem(item._id)}
            />
          ))}
        </div>
          <div className="cart-page__summary">
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal ({totalItems} items)</span>
              <span>{currency} {totalAmount}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery</span>
              <span className="cart-summary__free">Free</span>
            </div>
            <hr className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{currency} {totalAmount}</span>
            </div>
            <button className="cart-summary__checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
    


export default AddToCart