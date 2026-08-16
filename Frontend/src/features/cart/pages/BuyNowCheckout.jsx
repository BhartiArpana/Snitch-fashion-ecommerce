import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useCart } from "../hook/useCart";
import { useProduct } from "../../products/hook/useProduct";
import { useRazorpayCheckout } from "../hook/useRazorpayCheckout";
import "../style/buyNowCheckout.scss";

function BuyNowCheckout() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGetProductDetails } = useProduct();
  const { handleCreateBuyNowOrder } = useCart();
  const { launchCheckout } = useRazorpayCheckout();

  const product = useSelector((state) => state.products.productDeatails);
  const isLoading = useSelector((state) => state.products.loading);
  const user = useSelector((state) => state.auth.user);

  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (productId) handleGetProductDetails(productId);
  }, [productId]);

  const variant = product?.variants?.find((v) => v._id === variantId);
  const addresses = user?.address || [];
  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || null;

  const price = variant?.price?.amount || product?.price?.amount || 0;
  const currency = variant?.price?.currency || product?.price?.currency || "INR";
  const total = price * quantity;

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  function increaseQty() {
    setQuantity((q) => Math.min(variant?.stock || 1, q + 1));
  }

  function handleChangeAddress() {
    navigate("/address", {
      state: { mode: "buyNow", productId, variantId, quantity },
    });
  }

  async function handleProceed() {
    if (!defaultAddress) {
      navigate("/address/add", {
        state: { mode: "buyNow", productId, variantId, quantity },
      });
      return;
    }
    setPlacing(true);
    try {
      const order = await handleCreateBuyNowOrder({
        productId,
        variantId,
        quantity,
        addressId: defaultAddress._id,
      });
      console.log('order',order)
      launchCheckout(order);
    } finally {
      setPlacing(false);
    }
  }

  if (isLoading || !product || !variant) {
    return <div className="buy-now-checkout__loading">Loading...</div>;
  }

 return (
    <div className="buy-now-checkout">
      <h1 className="buy-now-checkout__title">Checkout</h1>

      <div className="buy-now-checkout__grid">
        {/* LEFT COLUMN */}
        <div className="buy-now-checkout__left">
          <section className="checkout-card checkout-card--product">
            <img
              className="checkout-card__image"
              src={variant.images?.[0]?.url || product.images?.[0]?.url}
              alt={product.title}
            />
            <div className="checkout-card__info">
              <p className="checkout-card__name">{product.title}</p>
              {variant.attribut && (
                <p className="checkout-card__variant">
                  {Object.entries(variant.attribut)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" / ")}
                </p>
              )}
              <p className="checkout-card__price">
                {currency === "INR" ? "₹" : currency} {price}
              </p>

              <div className="qty-stepper">
                <button
                  type="button"
                  className="qty-stepper__btn"
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-stepper__value">{quantity}</span>
                <button
                  type="button"
                  className="qty-stepper__btn"
                  onClick={increaseQty}
                  disabled={quantity >= (variant.stock || 1)}
                >
                  +
                </button>
              </div>
            </div>
          </section>

          <section className="checkout-card checkout-card--address">
            <div className="checkout-card__header">
              <span className="checkout-card__label">Deliver to</span>
              <button
                type="button"
                className="text-link"
                onClick={handleChangeAddress}
              >
                Change Address
              </button>
            </div>

            {defaultAddress ? (
              <div className="address-block">
                <p className="address-block__name">
                  {defaultAddress.name}
                  {defaultAddress.isDefault && (
                    <span className="address-block__badge">Default</span>
                  )}
                </p>
                <p className="address-block__line">
                  {defaultAddress.street}, {defaultAddress.city},{" "}
                  {defaultAddress.state} - {defaultAddress.pincode}
                </p>
                <p className="address-block__line">{defaultAddress.country}</p>
                <p className="address-block__phone">
                  Phone Number - {defaultAddress.mobileNumber}
                </p>
              </div>
            ) : (
              <p className="address-block__empty">No address saved yet.</p>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN — sticky summary */}
        <div className="buy-now-checkout__right">
          <section className="checkout-card checkout-card--summary">
            <p className="checkout-card__label">Order Summary</p>

            <div className="summary-row">
              <span>Price ({quantity} item{quantity > 1 ? "s" : ""})</span>
              <span>
                {currency === "INR" ? "₹" : currency} {total}
              </span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row summary-row--total">
              <span>Total Amount</span>
              <span>
                {currency === "INR" ? "₹" : currency} {total}
              </span>
            </div>

            <button
              type="button"
              className="proceed-btn"
              disabled={placing}
              onClick={handleProceed}
            >
              {placing ? "Placing order..." : "Proceed to Payment"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BuyNowCheckout;