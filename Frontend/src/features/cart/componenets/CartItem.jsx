import '../style/cartItem.scss';
import { useProduct } from '../../products/hook/useProduct';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hook/useCart';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { product, variants: variantId, quantity, price } = item;
  const {handleGetProductDetails} =useProduct()
  const selectedVariant = product?.variants?.find((v) => v._id === variantId);
  const image = selectedVariant?.image?.[0]?.url || product?.images?.[0]?.url;
  const navigate = useNavigate()
  const {handleIncrementCartItem} = useCart()
  const [updateCartQuantity,setUpdateCartQuantity]=useState(quantity)
  
  
 
  
  // console.log('varinats',variantId);
  //  console.log('productId ',product?._id);
  

  async function handleCartDetails(id){
    //  navigate(`/products/${id}`)
    //  onClick={()=>handleCartDetails(product._id)}
  }

  return (
    <div className="cart-item" >
      <div className="cart-item__image">
        <img src={image} alt={product?.title || 'Product'} />
      </div>

      <div className="cart-item__details">
        <div className="cart-item__top">
          <div className="cart-item__text">
            <h3 className="cart-item__title">{product?.title}</h3>
            <p className="cart-item__description">{product?.description}</p>
          </div>
          <button className="cart-item__remove" onClick={onRemove} aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {selectedVariant?.attribut && (
          <div className="cart-item__attributes">
            {Object.entries(selectedVariant.attribut).map(([key, value]) => (
              <span key={key} className="cart-item__attribute">{key}: {value}</span>
            ))}
          </div>
        )}

        <div className="cart-item__bottom">
          <div className="cart-item__quantity">
            <button className="cart-item__qty-btn" onClick={onDecrease} disabled={quantity <= 1} aria-label="Decrease quantity">−</button>
            <span className="cart-item__qty-value">{quantity}</span>
            <button className="cart-item__qty-btn" onClick={()=>{
              setUpdateCartQuantity(quantity)
              handleIncrementCartItem({productId:product?._id,variantId})
              
            }} aria-label="Increase quantity">+</button>
          </div>

          <div className="cart-item__price">
            <span className="cart-item__price-unit">{price.currency} {price.amount} each</span>
            <span className="cart-item__price-total">{price.currency} {price.amount * quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;