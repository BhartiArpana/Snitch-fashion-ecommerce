import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import '../style/sellerProductDetails.scss';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const CURRENCY_SYMBOL = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const emptyForm = {
  selectedExisting: [],
  newImages: [], // [{ localId, file, previewUrl }]
  stock: 0,
  attributes: [{ key: '', value: '' }],
  amount: '',
  currency: 'INR',
  additionalInfo: '',
};

function SellerProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails,handleAddProductVariants } = useProduct();
  const product = useSelector((state) => state.products.productDeatails);

  const [activeImage, setActiveImage] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeVariantThumb, setActiveVariantThumb] = useState({});

  useEffect(() => {
    handleGetProductDetails(id);
  }, [id]);

  // revoke blob URLs when they're no longer needed, to avoid leaks
  useEffect(() => {
    return () => {
      form.newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [form.newImages]);

  const variants = product?.variants || [];
  const productImages = product?.images || [];

  // every image already uploaded anywhere on this product — product-level + all variants,
  // deduped by url — so a seller can reuse instead of re-uploading
  const existingImagePool = useMemo(() => {
    const seen = new Map();
    productImages.forEach((img) => img?.url && seen.set(img.url, img.url));
    variants.forEach((v) => (v.image || []).forEach((img) => img?.url && seen.set(img.url, img.url)));
    return Array.from(seen.values());
  }, [productImages, variants]);

  function openAddPanel() {
    setEditingVariantId(null);
    setForm(emptyForm);
    setIsPanelOpen(true);
  }

  function openEditPanel(variant, index) {
    setEditingVariantId(variant._id ?? index);
    setForm({
      selectedExisting: (variant.image || []).map((img) => img.url).filter(Boolean),
      newImages: [],
      stock: variant.stock ?? 0,
      attributes: variant.attribut && Object.keys(variant.attribut).length
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

    console.log('variantPayload ', variantPayload.stock);
    await handleAddProductVariants({id,variantPayload})
    

    // TODO: wire this up once the API is available.
    // Adding a variant will likely need multipart/form-data for newImageFiles
    // (or an upload endpoint that returns URLs first), then a call to
    // create/update the variant with existingImageUrls + the returned URLs.
    console.log(editingVariantId ? 'Update variant:' : 'Create variant:', variantPayload);

    closePanel();
  }

  function getVariantImages(variant) {
    return (variant.image || []).filter((img) => img?.url);
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <p className="product-details-page__loading">Loading product…</p>
      </div>
    );
  }

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
          <p className="product-details-header__eyebrow">Product</p>
        </div>
      </header>

      {/* ── Product gallery — thumbnail rail + hero image + info ───────── */}
      <section className="product-gallery">
        <div className="product-gallery__thumbs">
          {(productImages.length ? productImages : [{ url: '/placeholder.png' }]).map((img, index) => (
            <button
              key={img.url + index}
              className={`product-gallery__thumb ${index === activeImage ? 'is-active' : ''}`}
              onClick={() => setActiveImage(index)}
            >
              <img src={img.url} alt={`${product.title} ${index + 1}`} />
            </button>
          ))}
        </div>

        <div className="product-gallery__main">
          <img
            src={productImages[activeImage]?.url || '/placeholder.png'}
            alt={product.title}
          />
        </div>

        <div className="product-gallery__info">
          {product.category && <span className="product-gallery__category">{product.category}</span>}
          <h1 className="product-gallery__title">{product.title}</h1>
          <p className="product-gallery__price">
            {CURRENCY_SYMBOL[product.price?.currency] || `${product.price?.currency} `}
            {product.price?.amount}
          </p>
          {product.description && (
            <p className="product-gallery__description">{product.description}</p>
          )}

          <div className="product-gallery__stats">
            <div>
              <span className="product-gallery__stats-value">{variants.length}</span>
              <span className="product-gallery__stats-label">Variant{variants.length !== 1 ? 's' : ''}</span>
            </div>
            <div>
              <span className="product-gallery__stats-value">
                {variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
              </span>
              <span className="product-gallery__stats-label">Total stock</span>
            </div>
          </div>

          <button className="btn-primary product-gallery__add-btn" onClick={openAddPanel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Variant
          </button>
        </div>
      </section>

      {/* ── Variants ─────────────────────────────────────────────────── */}
      <section className="variants-section">
        <h2 className="variants-section__title">Variants</h2>

        {variants.length === 0 ? (
          <div className="empty-state">
            <p>No variants yet. Add sizes, colors, or other options for this product.</p>
          </div>
        ) : (
          <div className="variant-grid">
            {variants.map((variant, index) => {
              const images = getVariantImages(variant);
              const activeThumb = activeVariantThumb[index] ?? 0;
              const inStock = (variant.stock ?? 0) > 0;
              const attributEntries = variant.attribut ? Object.entries(variant.attribut) : [];

              return (
                <div className="variant-card" key={variant._id || index}>
                  <div className="variant-card__image-wrap">
                    <img
                      src={images[activeThumb]?.url || productImages[0]?.url || '/placeholder.png'}
                      alt={`${product.title} variant ${index + 1}`}
                      className="variant-card__image"
                    />
                    <span className={`variant-card__stock ${inStock ? 'in-stock' : 'out-stock'}`}>
                      {inStock ? `${variant.stock} in stock` : 'Out of stock'}
                    </span>
                    <button
                      className="variant-card__edit-btn"
                      onClick={() => openEditPanel(variant, index)}
                      aria-label="Edit variant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>

                  {images.length > 1 && (
                    <div className="variant-card__thumbs">
                      {images.map((img, i) => (
                        <button
                          key={img.url + i}
                          className={`variant-card__thumb ${i === activeThumb ? 'is-active' : ''}`}
                          onClick={() => setActiveVariantThumb((prev) => ({ ...prev, [index]: i }))}
                        >
                          <img src={img.url} alt="" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="variant-card__body">
                    <p className="variant-card__price">
                      {CURRENCY_SYMBOL[variant.price?.currency] || `${variant.price?.currency} `}
                      {variant.price?.amount}
                    </p>

                    {attributEntries.length > 0 && (
                      <div className="variant-card__attributes">
                        {attributEntries.map(([key, value]) => (
                          <span className="variant-card__chip" key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {variant.Additional_info && (
                      <p className="variant-card__info">{variant.Additional_info}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Add / edit variant panel ────────────────────────────────── */}
      {isPanelOpen && (
        <>
          <div className="variant-panel__backdrop" onClick={closePanel} aria-hidden="true" />
          <aside className="variant-panel">
            <div className="variant-panel__header">
              <h2>{editingVariantId !== null ? 'Edit Variant' : 'Add Variant'}</h2>
              <button className="variant-panel__close" onClick={closePanel} aria-label="Close panel">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="variant-form" onSubmit={handleSubmit}>
              {/* Existing images — reuse anything already uploaded on this product */}
              {existingImagePool.length > 0 && (
                <div className="variant-form__group">
                  <label>Use an existing image</label>
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

              {/* Upload new images from device */}
              <div className="variant-form__group">
                <label>Upload new images</label>
                <label className="file-dropzone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Click to choose images from your device</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    hidden
                  />
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
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="variant-form__group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                />
              </div>

              <div className="variant-form__group">
                <label>Attributes</label>
                {form.attributes.map((attr, index) => (
                  <div className="variant-form__row variant-form__row--attr" key={index}>
                    <input
                      type="text"
                      placeholder="e.g. Size, Color, RAM, SSD"
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="e.g. Large, Red, 8GB, 256GB"
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
                <button type="submit" className="btn-primary">
                  {editingVariantId !== null ? 'Save Changes' : 'Add Variant'}
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