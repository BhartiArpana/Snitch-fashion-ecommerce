import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import '../style/orderSuccess.scss';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGetCart } = useCart();

  // Read cart data from Redux state
  const cartData = useSelector((state) => state.cart?.items);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!cartData || !cartData.items) {
      handleGetCart();
    }
  }, []);

  // Extract items list and total payment amount from state (using items.totalPrice)
  const cartItemsList = cartData?.items || location.state?.items || [];
  const totalPrice = location.state?.totalPrice;
  const currency = location.state?.currency || 'INR';
  

  const displayItems = cartItemsList.length > 0 ? cartItemsList : [];
  const formattedTotal = typeof totalPrice === 'number' ? totalPrice.toLocaleString() : totalPrice;

  // Order Details Metadata
  const orderId = location.state?.orderId || `SNTCH-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const defaultAddress = location.state?.address || user?.address?.[0];

  return (
    <div className="order-success-page">
      <div className="order-success-page__container">

        {/* ── Hero Banner Section ───────────────── */}
        <section className="order-success-page__hero">
          <div className="order-success-page__icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="order-success-page__hero-title">Order Placed Successfully!</h1>
          <p className="order-success-page__hero-subtitle">
            Thank you for shopping with SNITCH. Your payment was verified and your order is now being processed.
          </p>

          <div className="order-success-page__order-pills">
            <div className="order-success-page__pill">
              <span>Order ID:</span> #{orderId}
            </div>
            <div className="order-success-page__pill">
              <span>Date:</span> {orderDate}
            </div>
            <div className="order-success-page__pill order-success-page__pill--highlight">
              ✓ PAYMENT SUCCESSFUL
            </div>
          </div>
        </section>

        {/* ── Delivery Tracker Progress ───────────────── */}
        <section className="order-success-page__tracker-card">
          <h3 className="order-success-page__tracker-title">Delivery Progress</h3>
          <div className="order-success-page__timeline">
            <div className="order-success-page__timeline-step">
              <div className="order-success-page__step-dot order-success-page__step-dot--completed">✓</div>
              <span className="order-success-page__step-label">Order Confirmed</span>
              <span className="order-success-page__step-date">Today</span>
            </div>
            <div className="order-success-page__timeline-step">
              <div className="order-success-page__step-dot order-success-page__step-dot--current">•</div>
              <span className="order-success-page__step-label">Processing</span>
              <span className="order-success-page__step-date">In Progress</span>
            </div>
            <div className="order-success-page__timeline-step">
              <div className="order-success-page__step-dot">3</div>
              <span className="order-success-page__step-label">Shipped</span>
              <span className="order-success-page__step-date">Expected Soon</span>
            </div>
            <div className="order-success-page__timeline-step">
              <div className="order-success-page__step-dot">4</div>
              <span className="order-success-page__step-label">Delivered</span>
              <span className="order-success-page__step-date">3 - 5 Business Days</span>
            </div>
          </div>
        </section>

        {/* ── Main Details Layout (2 Columns) ───────────────── */}
        <div className="order-success-page__grid">

          {/* ── Left Column: Items & Delivery Information ───────────────── */}
          <div className="order-success-page__main-column">
            
            {/* Purchased Items Card */}
            {/* <div className="order-success-page__card">
              <h3 className="order-success-page__card-title">
                Purchased Items ({displayItems.length})
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  SNITCH EXPRESS DELIVERY
                </span>
              </h3>

              <div className="order-success-page__items-list">
                {displayItems.map((item, index) => {
                  const productObj = item.product || item;
                  const title = productObj.title || productObj.name || 'SNITCH Fashion Apparel';
                  const img = productObj.images?.[0]?.url || productObj.images?.[0] || productObj.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80';
                  const itemQty = item.quantity || 1;
                  const unitPrice = item.price?.amount || productObj.price || 1499;
                  const itemTotal = unitPrice * itemQty;

                  return (
                    <div key={item._id || index} className="order-success-page__item">
                      <div className="order-success-page__item-image">
                        <img src={img} alt={title} />
                      </div>
                      <div className="order-success-page__item-details">
                        <h4 className="order-success-page__item-name">{title}</h4>
                        <div className="order-success-page__item-meta">
                          {item.size && <span className="order-success-page__item-chip">Size: {item.size}</span>}
                          {item.color && <span className="order-success-page__item-chip">Color: {item.color}</span>}
                          <span className="order-success-page__item-chip">Qty: {itemQty}</span>
                        </div>
                        <div className="order-success-page__item-price-row">
                          <span className="order-success-page__item-qty">Unit: ₹{unitPrice.toLocaleString()}</span>
                          <span className="order-success-page__item-price">₹{itemTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}

            {/* Shipping Address & Payment Card */}
            <div className="order-success-page__card">
              <h3 className="order-success-page__card-title">Delivery & Payment Info</h3>
              
              <div className="order-success-page__info-grid">
                <div className="order-success-page__info-box">
                  <h4>Delivery Address</h4>
                  <p className="order-success-page__info-name">{defaultAddress?.name || user?.fullName || 'Valued Customer'}</p>
                  <p className="order-success-page__info-text">
                    {defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pincode}` : 'Standard Home Delivery Address'}
                  </p>
                  <p className="order-success-page__info-text">
                    📞 {defaultAddress?.mobileNumber || user?.mobileNumber || 'Registered Mobile'}
                  </p>
                </div>

                <div className="order-success-page__info-box">
                  <h4>Payment Summary</h4>
                  <p className="order-success-page__info-name">Razorpay / Online UPI</p>
                  <p className="order-success-page__info-text">
                    Payment Status: <strong style={{ color: '#10b981' }}>PAID</strong><br />
                    Transaction: SUCCESS<br />
                    Total Paid: <strong>{currency} {formattedTotal}</strong>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column: Payment Breakdown & Actions ───────────────── */}
          <div className="order-success-page__sidebar">
            
            <div className="order-success-page__card order-success-page__card--highlight">
              <h3 className="order-success-page__card-title">Payment Summary</h3>
              
              <div className="order-success-page__summary-rows">
                <div className="order-success-page__summary-row">
                  <span>Cart Items Subtotal</span>
                  <span>{currency} {formattedTotal}</span>
                </div>

                <div className="order-success-page__summary-row order-success-page__summary-row--free">
                  <span>Shipping & Delivery</span>
                  <span>FREE</span>
                </div>

                <div className="order-success-page__summary-row order-success-page__summary-row--total">
                  <span>Successful Payment</span>
                  <span>{currency} {formattedTotal}</span>
                </div>
              </div>

              <div className="order-success-page__actions">
                <button
                  className="order-success-page__btn-primary"
                  onClick={() => navigate('/')}
                  type="button"
                >
                  CONTINUE SHOPPING
                </button>

                <button
                  className="order-success-page__btn-outline"
                  onClick={() => navigate('/cart')}
                  type="button"
                >
                  VIEW CART
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="order-success-page__support-card">
              <p>Questions regarding your order?</p>
              <a href="mailto:support@snitch.co.in">Contact SNITCH Support</a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;