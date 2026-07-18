import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useState, useEffect, useMemo } from "react";
import "../style/cardDetails.scss";
import { useCart } from "../../cart/hook/useCart";


function parseStructuredText(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^SKU[:\s]/i.test(block)) {
        return { type: "sku", content: block.replace(/^SKU[:\s]*/i, "") };
      }
      const dashParts = block.split(" - ");
      if (dashParts.length === 2 && !block.includes("\n") && block.length < 60) {
        return { type: "spec", label: dashParts[0].trim(), value: dashParts[1].trim() };
      }
      const wordCount = block.split(/\s+/).length;
      if (wordCount <= 4 && !block.endsWith(".") && !block.includes(" - ")) {
        return { type: "heading", content: block };
      }
      return { type: "para", content: block };
    });
}

function InfoBlocks({ text }) {
  const blocks = useMemo(() => parseStructuredText(text), [text]);
  if (!blocks.length) return null;

  return (
    <div className="info-blocks">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return <h3 className="info-blocks__heading" key={i}>{block.content}</h3>;
        }
        if (block.type === "spec") {
          return (
            <div className="info-blocks__spec" key={i}>
              <span className="info-blocks__spec-label">{block.label}</span>
              <span className="info-blocks__spec-value">{block.value}</span>
            </div>
          );
        }
        if (block.type === "sku") {
          return (
            <p className="info-blocks__sku" key={i}>
              <span>SKU</span>
              {block.content}
            </p>
          );
        }
        return <p className="info-blocks__para" key={i}>{block.content}</p>;
      })}
    </div>
  );
}

function CardDetails() {
  const {handleAddToCartHook}  = useCart()
  const { id } = useParams();
  const { handleGetProductDetails } = useProduct();
  const product = useSelector((state) => state.products.productDeatails);
  const isLoading = useSelector((state) => state.products.loading);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation
 

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]); // null = base product
  const [infoExpanded, setInfoExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      handleGetProductDetails(id);
    }
  }, [id]);

  // Reset selection whenever a new product loads
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedVariant(product?.variants?.[0] || null);
    setInfoExpanded(false);
  }, [product]);

  function handleSelectVariant(variant) {
    setSelectedVariant(variant);
    setActiveImageIndex(0); // reset thumbnail index for the new image set
  }

  async function handleAddToCard({productId,variantId}) {
    if (!user) {
      navigate("/login",{state:{from:location.pathname}});
      return 
    }
     await handleAddToCartHook({productId,variantId})
    // console.log('product ',product._id);
    // console.log('variant ',selectedVariant._id);
    
  }

  function handleBuyNow() {
    if (!user) {
      navigate("/login");
    }
  }

  if (isLoading) {
    return (
      <div className="product-details-shimmer">
        <div className="shimmer-breadcrumbs animate-shimmer"></div>
        <div className="shimmer-container">
          <div className="shimmer-gallery">
            <div className="shimmer-thumbnails">
              {[1, 2, 3].map((n) => (
                <div key={n} className="shimmer-thumb animate-shimmer"></div>
              ))}
            </div>
            <div className="shimmer-main-image animate-shimmer"></div>
          </div>
          <div className="shimmer-info">
            <div className="shimmer-title animate-shimmer"></div>
            <div className="shimmer-price animate-shimmer"></div>
            <div className="shimmer-sizes animate-shimmer"></div>
            <div className="shimmer-btn animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2>Product Not Found</h2>
        <p>We couldn't retrieve the details for this product. It may have been removed.</p>
        <Link to="/" className="product-details-error__btn">Back to Shop</Link>
      </div>
    );
  }

  // Active image set: variant images if a variant is selected, else base product images
  const images = selectedVariant ? selectedVariant.image || [] : product.images || [];
  const variants = product.variants || [];
  const currentImage =
    images[activeImageIndex]?.url ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop";

  const activePrice = selectedVariant ? selectedVariant.price : product.price;

  // Figure out which attribute key drives the variant swatches (e.g. "color")
  const attributeKey =
    variants.find((v) => v.attribut && Object.keys(v.attribut).length)?.attribut &&
    Object.keys(variants.find((v) => v.attribut && Object.keys(v.attribut).length).attribut)[0];

  const hasAdditionalInfo = Boolean(product.additional_info);
  
  return (
    <div className="product-details">
      {/* Breadcrumbs */}
      <nav className="product-details__breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>

      <div className="product-details__container">
        {/* Left Side: Image Gallery */}
        <div className="product-gallery">
          {images.length > 0 && (
            <div className="product-gallery__thumbnails">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  className={`thumbnail-btn ${activeImageIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="product-gallery__main">
            <img src={currentImage} alt={product.title} />
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="product-info">
          {product.category && (
            <span className="product-info__category">{product.category}</span>
          )}
          <h1 className="product-info__title">{product.title}</h1>

          <div className="product-info__price-box">
            <span className="product-info__price">
              {activePrice?.currency === "INR" ? "₹" : `${activePrice?.currency} `}
              {activePrice?.amount}
            </span>
            <span className="product-info__tax-label">Inclusive of all taxes</span>
          </div>

          <p className="product-info__desc">{product.description}</p>

          {/* Variant Selector */}
          {variants.length > 0 && (
            <div className="variant-selector">
              <div className="variant-selector__header">
                <span className="selector-title">
                  {attributeKey ? attributeKey.toUpperCase() : "OPTIONS"}
                  {selectedVariant?.attribut?.[attributeKey] && (
                    <span className="selector-title__value">
                      : {selectedVariant.attribut[attributeKey]}
                    </span>
                  )}
                </span>
              </div>
              <div className="variant-selector__options">
  {variants.map((variant) => (
    <button
      key={variant._id}
      className={`variant-swatch ${selectedVariant?._id === variant._id ? "active" : ""}`}
      onClick={() => handleSelectVariant(variant)}
      type="button"
      title={attributeKey ? variant.attribut?.[attributeKey] : undefined}
    >
      <img src={variant.image?.[0]?.url} alt={variant.attribut?.[attributeKey] || "Variant"} />
      {attributeKey && variant.attribut?.[attributeKey] && (
        <span className="variant-swatch__label">{variant.attribut[attributeKey]}</span>
      )}
    </button>
  ))}
</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="product-actions">
            <div className="product-actions__primary">
              <button className="add-to-cart-btn" onClick={()=>{
                handleAddToCard({
                  productId:product._id,
                  variantId:selectedVariant._id
                })
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                ADD TO CART
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                BUY NOW
              </button>
            </div>
            <button className="wishlist-btn" aria-label="Add to wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Delivery / Trust Badges */}
          <div className="product-trust">
            <div className="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              <span>Free delivery on orders above ₹499</span>
            </div>
            <div className="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>Easy 7-day returns</span>
            </div>
            <div className="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information - full width, bottom of page, with Read more/less */}
      {hasAdditionalInfo && (
        <section className="product-additional-info">
          <h2 className="product-additional-info__title">Product Details</h2>
          <div className={`product-additional-info__body ${infoExpanded ? "is-expanded" : ""}`}>
            <InfoBlocks text={product.additional_info} />
          </div>
          <button
            type="button"
            className="product-additional-info__toggle"
            onClick={() => setInfoExpanded((v) => !v)}
          >
            {infoExpanded ? "Show less" : "Read more"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={infoExpanded ? "rotated" : ""}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </section>
      )}
    </div>
  );
}

export default CardDetails;