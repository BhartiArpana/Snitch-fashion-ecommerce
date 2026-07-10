import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import '../style/sellerProductDetails.scss';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const emptyForm = {
  selectedExisting: [],
  newImages: [],
  stock: 0,
  attributes: [{ key: '', value: '' }],
  amount: '',
  currency: 'INR',
  additionalInfo: '',
};

function formatPrice(amount, currency) {
  if (amount === undefined || amount === null || amount === '') return '—';
  const symbol = CURRENCY_SYMBOL[currency] || `${currency} `;
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
}

function parseStructuredText(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^SKU[:\s]/i.test(block)) {
        return { type: 'sku', content: block.replace(/^SKU[:\s]*/i, '') };
      }
      const dashParts = block.split(' - ');
      if (dashParts.length === 2 && !block.includes('\n') && block.length < 60) {
        return { type: 'spec', label: dashParts[0].trim(), value: dashParts[1].trim() };
      }
      const wordCount = block.split(/\s+/).length;
      if (wordCount <= 4 && !block.endsWith('.') && !block.includes(' - ')) {
        return { type: 'heading', content: block };
      }
      return { type: 'para', content: block };
    });
}

function InfoBlocks({ text }) {
  const blocks = useMemo(() => parseStructuredText(text), [text]);
  if (!blocks.length) return null;

  return (
    <div className="info-blocks">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h3 className="info-blocks__heading" key={i}>
              {block.content}
            </h3>
          );
        }
        if (block.type === 'spec') {
          return (
            <div className="info-blocks__spec" key={i}>
              <span className="info-blocks__spec-label">{block.label}</span>
              <span className="info-blocks__spec-value">{block.value}</span>
            </div>
          );
        }
        if (block.type === 'sku') {
          return (
            <p className="info-blocks__sku" key={i}>
              <span>SKU</span>
              {block.content}
            </p>
          );
        }
        return (
          <p className="info-blocks__para" key={i}>
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

function ImageTile({ src, alt = '', className = '' }) {
  if (!src) {
    return (
      <div className={`img-fallback ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}

function StockStepper({ value, onChange }) {
  const num = Number(value) || 0;
  return (
    <div className="stepper">
      <button type="button" className="stepper__btn" onClick={() => onChange(Math.max(0, num - 1))} aria-label="Decrease stock">
        −
      </button>
      <input
        type="number"
        min="0"
        className="stepper__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" className="stepper__btn" onClick={() => onChange(num + 1)} aria-label="Increase stock">
        +
      </button>
    </div>
  );
}

// ── main component ──────────────────────────────────────────────

function SellerProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails, handleAddProductVariants } = useProduct();
  const product = useSelector((state) => state.products.productDeatails);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null); // null = base product
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeVariantThumb, setActiveVariantThumb] = useState({});
  const [descExpanded, setDescExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    handleGetProductDetails(id);
  }, [id]);

  // reset gallery selection whenever we load a different product
  useEffect(() => {
    setSelectedVariantIndex(null);
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    return () => {
      form.newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [form.newImages]);

  const variants = product?.variants || [];
  const productImages = product?.images || [];

  function getVariantImages(variant) {
    return (variant?.image || []).filter((img) => img?.url);
  }

  const existingImagePool = useMemo(() => {
    const seen = new Map();
    productImages.forEach((img) => img?.url && seen.set(img.url, img.url));
    variants.forEach((v) => (v.image || []).forEach((img) => img?.url && seen.set(img.url, img.url)));
    return Array.from(seen.values());
  }, [productImages, variants]);

  const priceStats = useMemo(() => {
    const amounts = variants.map((v) => v.price?.amount).filter((n) => typeof n === 'number');
    if (!amounts.length) {
      return { min: product?.price?.amount, max: product?.price?.amount, currency: product?.price?.currency };
    }
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
      currency: variants[0]?.price?.currency || product?.price?.currency,
    };
  }, [variants, product]);

  const totalStock = useMemo(() => variants.reduce((sum, v) => sum + (v.stock || 0), 0), [variants]);

  // selected variant object (or null -> base product)
  const selectedVariant = selectedVariantIndex !== null ? variants[selectedVariantIndex] : null;

  // images shown in the main gallery — variant's images if a variant is selected, else base product images
  const galleryImages = useMemo(() => {
    if (selectedVariant) {
      const vImgs = getVariantImages(selectedVariant);
      return vImgs.length ? vImgs : productImages;
    }
    return productImages;
  }, [selectedVariant, productImages]);

  function selectVariantView(index) {
    setSelectedVariantIndex((prev) => (prev === index ? null : index)); // click again to go back to base product
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openAddPanel() {
    setEditingVariantId(null);
    setForm(emptyForm);
    setIsPanelOpen(true);
  }

  function openEditPanel(e, variant, index) {
    if (e) e.stopPropagation(); // don't trigger the card's onClick (gallery selection)
    setEditingVariantId(variant._id ?? index);
    setForm({
      selectedExisting: (variant.image || []).map((img) => img.url).filter(Boolean),
      newImages: [],
      stock: variant.stock ?? 0,
      attributes:
        variant.attribut && Object.keys(variant.attribut).length
          ? Object.entries(variant.attribut).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],
      amount: variant.price?.amount ?? '',
      currency: variant.price?.currency || 'INR',
      additionalInfo: variant.Additional_info || '',
    });
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  function toggleExistingImage(url) {
    setForm((prev) => {
      const isSelected = prev.selectedExisting.includes(url);
      return {
        ...prev,
        selectedExisting: isSelected
          ? prev.selectedExisting.filter((u) => u !== url)
          : [...prev.selectedExisting, url],
      };
    });
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map((file) => ({
      localId: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, newImages: [...prev.newImages, ...withPreviews] }));
    e.target.value = '';
  }

  function removeNewImage(localId) {
    setForm((prev) => {
      const target = prev.newImages.find((img) => img.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return { ...prev, newImages: prev.newImages.filter((img) => img.localId !== localId) };
    });
  }

  function handleAttributeChange(index, field, value) {
    setForm((prev) => {
      const attributes = [...prev.attributes];
      attributes[index] = { ...attributes[index], [field]: value };
      return { ...prev, attributes };
    });
  }

  function addAttributeField() {
    setForm((prev) => ({ ...prev, attributes: [...prev.attributes, { key: '', value: '' }] }));
  }

  function removeAttributeField(index) {
    setForm((prev) => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount) return;

    const attributMap = {};
    form.attributes.forEach(({ key, value }) => {
      if (key.trim()) attributMap[key.trim()] = value;
    });

    const variantPayload = {
      existingImageUrls: form.selectedExisting,
      newImageFiles: form.newImages.map((img) => img.file),
      stock: Number(form.stock) || 0,
      attribut: attributMap,
      price: { amount: Number(form.amount), currency: form.currency },
      Additional_info: form.additionalInfo,
    };

    try {
      setSubmitting(true);
      await handleAddProductVariants({ id, variantPayload });
      await handleGetProductDetails(id);
      closePanel();
    } finally {
      setSubmitting(false);
    }
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="loading-state">
          <span className="loading-state__spinner" />
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  const descBlocks = parseStructuredText(product.description);
  const isDescLong = descBlocks.length > 2 || (product.description || '').length > 220;

  return (
    <div className="product-details-page">
      <header className="product-details-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="product-details-header__text">
          <p className="product-details-header__eyebrow">Seller · Product</p>
          <h1 className="product-details-header__title">{product.title}</h1>
        </div>
        <button className="btn-primary" onClick={openAddPanel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Variant
          </button>
      </header>

      {/* ── Gallery + info ─────────────────────────────────────────── */}
      <section className="product-gallery">
        <div className="product-gallery__thumbs">
          {galleryImages.length ? (
            galleryImages.map((img, index) => (
              <button
                key={img.url + index}
                className={`product-gallery__thumb ${index === activeImage ? 'is-active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <ImageTile src={img.url} alt={`${product.title} ${index + 1}`} />
              </button>
            ))
          ) : (
            <div className="product-gallery__thumb is-active">
              <ImageTile />
            </div>
          )}
        </div>

        <div className="product-gallery__main">
          <ImageTile src={galleryImages[activeImage]?.url} alt={product.title} />
        </div>

        <div className="product-gallery__info">
          {/* {selectedVariant && (
            <div className="gallery-variant-badge">
              <span>Viewing selected variant</span>
              <button type="button" onClick={() => selectVariantView(selectedVariantIndex)}>
                Back to base product
              </button>
            </div>
          )} */}

          <p className="product-gallery__price">
            {selectedVariant
              ? formatPrice(selectedVariant.price?.amount, selectedVariant.price?.currency)
              : priceStats.min === priceStats.max
              ? formatPrice(priceStats.min, priceStats.currency)
              : `${formatPrice(priceStats.min, priceStats.currency)} – ${formatPrice(priceStats.max, priceStats.currency)}`}
          </p>

          {product.description && (
            <div className={`product-gallery__desc ${descExpanded ? 'is-expanded' : ''}`}>
              <InfoBlocks text={product.description} />
              {isDescLong && (
                <button type="button" className="text-toggle" onClick={() => setDescExpanded((v) => !v)}>
                  {descExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}

          <div className="product-gallery__stats">
            <div className="product-gallery__stat">
              <span className="product-gallery__stat-value">{variants.length}</span>
              <span className="product-gallery__stat-label">Variant{variants.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="product-gallery__stat">
              <span className="product-gallery__stat-value">{totalStock}</span>
              <span className="product-gallery__stat-label">Total stock</span>
            </div>
            <div className="product-gallery__stat">
              <span className="product-gallery__stat-value">{galleryImages.length}</span>
              <span className="product-gallery__stat-label">Image{galleryImages.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Variants ───────────────────────────────────────────────── */}
      <section className="variants-section">
        <div className="variants-section__header">
          <div>
            <h2 className="variants-section__title">Variants</h2>
            <span className="variants-section__count">{variants.length} total</span>
          </div>
          
        </div>

        {variants.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M3 7l3-4h12l3 4" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            <p>No variants yet. Add sizes, colors, or other options for this product.</p>
            <button className="btn-secondary" onClick={openAddPanel}>Add your first variant</button>
          </div>
        ) : (
          <div className="variant-grid">
            {variants.map((variant, index) => {
              const images = getVariantImages(variant);
              const activeThumb = activeVariantThumb[index] ?? 0;
              const inStock = (variant.stock ?? 0) > 0;
              const lowStock = inStock && variant.stock <= 5;
              const attributEntries = variant.attribut ? Object.entries(variant.attribut) : [];
              const isSelected = selectedVariantIndex === index;

              return (
                <div
                  className={`variant-card ${isSelected ? 'is-active' : ''}`}
                  key={variant._id || index}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectVariantView(index)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectVariantView(index)}
                >
                  <div className="variant-card__image-wrap">
                    <ImageTile
                      src={images[activeThumb]?.url || productImages[0]?.url}
                      alt={`${product.title} variant ${index + 1}`}
                      className="variant-card__image"
                    />
                    <span className={`variant-card__stock ${inStock ? (lowStock ? 'low-stock' : 'in-stock') : 'out-stock'}`}>
                      {inStock ? (lowStock ? `Only ${variant.stock} left` : `${variant.stock} in stock`) : 'Out of stock'}
                    </span>
                    <button
                      className="variant-card__edit-btn"
                      onClick={(e) => openEditPanel(e, variant, index)}
                      aria-label="Edit variant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>

                  {images.length > 1 && (
                    <div className="variant-card__dots">
                      {images.map((img, i) => (
                        <button
                          key={img.url + i}
                          className={`variant-card__dot ${i === activeThumb ? 'is-active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVariantThumb((prev) => ({ ...prev, [index]: i }));
                          }}
                          aria-label={`Show image ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="variant-card__body">
                    <p className="variant-card__price">{formatPrice(variant.price?.amount, variant.price?.currency)}</p>

                    {attributEntries.length > 0 && (
                      <div className="variant-card__attributes">
                        {attributEntries.map(([key, value]) => (
                          <span className="variant-card__chip" key={key}>
                            <span className="variant-card__chip-key">{key}</span>
                            {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {variant.Additional_info && <p className="variant-card__note">{variant.Additional_info}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Product details / spec sheet ──────────────────────────── */}
      {product.additional_info && (
        <section className="product-specs">
          <div className="product-specs__header">
            <h2 className="product-specs__title">Product Details</h2>
          </div>
          <div className="product-specs__body">
            <InfoBlocks text={product.additional_info} />
          </div>
        </section>
      )}

      {/* ── Add / edit variant drawer ─────────────────────────────── */}
      {isPanelOpen && (
        <>
          <div className="variant-panel__backdrop" onClick={closePanel} aria-hidden="true" />
          <aside className="variant-panel">
            <div className="variant-panel__header">
              <div>
                <p className="variant-panel__eyebrow">{editingVariantId !== null ? 'Editing' : 'New variant'}</p>
                <h2>{editingVariantId !== null ? 'Edit Variant' : 'Add Variant'}</h2>
              </div>
              <button className="variant-panel__close" onClick={closePanel} aria-label="Close panel">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="variant-form" onSubmit={handleSubmit}>
              {existingImagePool.length > 0 && (
                <div className="variant-form__group">
                  <label>Reuse an existing image</label>
                  <div className="image-picker">
                    {existingImagePool.map((url) => {
                      const isSelected = form.selectedExisting.includes(url);
                      return (
                        <button
                          type="button"
                          key={url}
                          className={`image-picker__tile ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => toggleExistingImage(url)}
                        >
                          <img src={url} alt="" />
                          {isSelected && (
                            <span className="image-picker__check">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="variant-form__group">
                <label>Upload new images</label>
                <label className="file-dropzone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to choose images from your device</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
                </label>

                {form.newImages.length > 0 && (
                  <div className="image-picker image-picker--previews">
                    {form.newImages.map((img) => (
                      <div className="image-picker__tile is-selected" key={img.localId}>
                        <img src={img.previewUrl} alt="" />
                        <button
                          type="button"
                          className="image-picker__remove"
                          onClick={() => removeNewImage(img.localId)}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="variant-form__group variant-form__group--split">
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label>Currency</label>
                  <select value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="variant-form__group">
                <label>Stock</label>
                <StockStepper value={form.stock} onChange={(val) => setForm((p) => ({ ...p, stock: val }))} />
              </div>

              <div className="variant-form__group">
                <label>Attributes</label>
                {form.attributes.map((attr, index) => (
                  <div className="variant-form__row variant-form__row--attr" key={index}>
                    <input
                      type="text"
                      placeholder="e.g. Size, Color, RAM"
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="e.g. Large, Red, 8GB"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    />
                    {form.attributes.length > 1 && (
                      <button
                        type="button"
                        className="variant-form__remove-btn"
                        onClick={() => removeAttributeField(index)}
                        aria-label="Remove attribute field"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="variant-form__add-btn" onClick={addAttributeField}>
                  + Add attribute
                </button>
              </div>

              <div className="variant-form__group">
                <label>Additional info</label>
                <textarea
                  rows="3"
                  placeholder="Care instructions, notes, etc."
                  value={form.additionalInfo}
                  onChange={(e) => setForm((p) => ({ ...p, additionalInfo: e.target.value }))}
                />
              </div>

              <div className="variant-form__actions">
                <button type="button" className="btn-secondary" onClick={closePanel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editingVariantId !== null ? 'Save Changes' : 'Add Variant'}
                </button>
              </div>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}

export default SellerProductDetails;