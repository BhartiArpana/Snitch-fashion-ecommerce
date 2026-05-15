import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useProduct } from '../hook/useProduct'
import '../styles/productDetailed.css'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'

const MAX_IMAGES = 7

const initialFormData = {
    images: [],
    imagePreviews: [],
    price: { amount: '', currency: 'INR' },
    stock: '',
    attributes: [{ key: '', value: '' }],
}

const ProductDetailed = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const { handleGetProductById, handleAddProductVariant } = useProduct()
    const user = useSelector((state) => state.auth.user)
    const theme = useSelector((state) => state.theme.theme) || 'light'

    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [formData, setFormData] = useState(initialFormData)
    const [showVariantForm, setShowVariantForm] = useState(false)
    const [toast, setToast] = useState(null)
    const fileInputRef = useRef(null)

    const [selectedVariant, setSelectedVariant] = useState(null)
    const [selectedAttributes, setSelectedAttributes] = useState({})

    const fetchDetails = async () => {
        try {
            const data = await handleGetProductById(productId)
            setProduct(data)
            setSelectedVariant(null)
            setSelectedAttributes({})
        } catch (error) {
            console.error('Failed to fetch product details', error)
        }
    }

    useEffect(() => {
        if (productId) {
            fetchDetails().then(() => setActiveImageIndex(0))
        }
    }, [productId])

    const showToastMsg = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const variants = product?.variants || []

    const availableAttributes = useMemo(() => {
        const attrs = {};
        let hasAnyAttributes = false;

        variants.forEach(v => {
            if (v.attributes && Object.keys(v.attributes).length > 0) {
                hasAnyAttributes = true;
                Object.entries(v.attributes).forEach(([k, val]) => {
                    if (!attrs[k]) attrs[k] = new Set();
                    attrs[k].add(val);
                });
            }
        });

        if (!hasAnyAttributes) {
            attrs['Style'] = new Set(['Standard']);
        }

        const formatted = {};
        for (const k in attrs) {
            formatted[k] = Array.from(attrs[k]);
        }
        return formatted;
    }, [variants]);

    if (!product) {
        return (
            <div className={`product-detailed-container ${theme}`}>
                <Navbar />
                <div className="pd-loading">Loading Product...</div>
            </div>
        )
    }

    const handleAttributeSelect = (key, value) => {
        if (key === 'Style' && value === 'Standard') {
            setSelectedAttributes({ [key]: value });
            const noAttrVariant = variants.find(v => !v.attributes || Object.keys(v.attributes).length === 0);
            setSelectedVariant(noAttrVariant || null);
            setActiveImageIndex(0);
            return;
        }

        const newSelected = { ...selectedAttributes, [key]: value };
        
        const matchedVariant = variants.find(v => {
            return Object.entries(newSelected).every(([k, val]) => {
                return v.attributes && v.attributes[k] === val;
            });
        });
        
        if (matchedVariant) {
            setSelectedAttributes(newSelected);
            setSelectedVariant(matchedVariant);
            setActiveImageIndex(0);
        } else {
            const fallbackVariant = variants.find(v => v.attributes && v.attributes[key] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes || {});
                setSelectedVariant(fallbackVariant);
                setActiveImageIndex(0);
            } else {
                setSelectedAttributes(newSelected);
            }
        }
    };

    const basePrice = product.price && typeof product.price === 'object' ? product.price.amount : product.price;
    const displayPrice = selectedVariant?.price?.amount || basePrice;
    
    const baseImages = product.image || [];
    const displayImages = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) 
        ? selectedVariant.images 
        : baseImages;
        
    const hasMultipleImages = displayImages.length > 1;
    const imageUrl = displayImages.length > 0
            ? (displayImages[activeImageIndex]?.url || displayImages[0].url)
            : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80';

    // ── Form Handlers ──────────────────────────────────────────────────────────

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const combined = [...formData.images, ...files].slice(0, MAX_IMAGES)
        const previews = combined.map((f) =>
            f instanceof File ? URL.createObjectURL(f) : f
        )
        setFormData((prev) => ({ ...prev, images: combined, imagePreviews: previews }))
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        const newPreviews = formData.imagePreviews.filter((_, i) => i !== index)
        setFormData((prev) => ({ ...prev, images: newImages, imagePreviews: newPreviews }))
    }

    const handlePriceChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, price: { ...prev.price, [name]: value } }))
    }

    const handleStockChange = (e) => {
        setFormData((prev) => ({ ...prev, stock: e.target.value }))
    }

    const handleAttributeChange = (index, field, value) => {
        const updated = formData.attributes.map((attr, i) =>
            i === index ? { ...attr, [field]: value } : attr
        )
        setFormData((prev) => ({ ...prev, attributes: updated }))
    }

    const handleAddAttribute = () => {
        setFormData((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: '', value: '' }],
        }))
    }

    const handleRemoveAttribute = (index) => {
        const updated = formData.attributes.filter((_, i) => i !== index)
        setFormData((prev) => ({
            ...prev,
            attributes: updated.length ? updated : [{ key: '', value: '' }],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const attributesMap = {}
            formData.attributes.forEach(({ key, value }) => {
                if (key.trim()) attributesMap[key.trim()] = value.trim()
            })
            const payload = {
                images: formData.images,
                price: { amount: formData.price.amount, currency: formData.price.currency },
                stock: Number(formData.stock),
                attributes: attributesMap,
            }
            await handleAddProductVariant(productId, payload)
            await fetchDetails()
            showToastMsg('Variant successfully created!')
            handleCloseForm()
        } catch (error) {
            console.error('Failed to add variant', error)
            showToastMsg('Failed to create variant.', 'error')
        }
    }

    const handleReset = () => {
        setFormData(initialFormData)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleCloseForm = () => {
        setShowVariantForm(false)
        setFormData(initialFormData)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className={`product-detailed-container ${theme}`}>
            {toast && (
                <div className="pd-toast-container">
                    <div className={`pd-toast ${toast.type === 'error' ? 'error' : ''}`}>
                        {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
                    </div>
                </div>
            )}
            <Navbar />

            {/* ── Hero: Image + Info ── */}
            <main className="pd-main">
                <div className="pd-image-section">
                    <div className="pd-main-image-container">
                        <img
                            src={imageUrl}
                            alt={product.title || 'Product Image'}
                            className="pd-main-image"
                        />
                    </div>
                    {hasMultipleImages && (
                        <div className="pd-thumbnail-list">
                            {displayImages.map((img, index) => (
                                <div
                                    key={img._id || index}
                                    className={`pd-thumbnail-wrapper ${index === activeImageIndex ? 'active' : ''}`}
                                    onClick={() => setActiveImageIndex(index)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="pd-thumbnail-image"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pd-info-section">
                    <h1 className="pd-title">{product.title}</h1>
                    <p className="pd-price">₹ {displayPrice}</p>
                    <div className="pd-description">
                        {product.description ||
                            'Premium quality clothing exclusive to Snitch. Discover the latest trends and elevate your wardrobe.'}
                    </div>

                    {Object.keys(availableAttributes).length > 0 && (
                        <div className="pd-attributes-selector">
                            {Object.entries(availableAttributes).map(([key, values]) => (
                                <div key={key} className="pd-attribute-group">
                                    <h4 className="pd-attr-title">{key}</h4>
                                    <div className="pd-attr-values">
                                        {values.map(val => (
                                            <button
                                                key={val}
                                                className={`pd-attr-btn ${selectedAttributes[key] === val ? 'selected' : ''}`}
                                                onClick={() => handleAttributeSelect(key, val)}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pd-actions">
                        <button className="pd-btn pd-add-to-cart">Add to Cart</button>
                        <button className="pd-btn pd-buy-now">Buy Now</button>
                    </div>
                </div>
            </main>

            {/* ── Variants & Inventory Section (Seller only) ── */}
            {user?.role === 'seller' && (
                <section className="pd-inventory-section">

                    {/* Section header row */}
                    <div className="pd-inventory-header">
                        <div className="pd-inventory-title-group">
                            <h2 className="pd-inventory-title">Variants &amp; Inventory</h2>
                            <span className="pd-inventory-count">
                                {variants.length} variant{variants.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <button
                            className="pd-btn-add-variant"
                            onClick={() => setShowVariantForm((prev) => !prev)}
                        >
                            {showVariantForm ? '✕ Cancel' : '+ Add Variant'}
                        </button>
                    </div>

                    {/* Variant Cards Grid */}
                    {variants.length > 0 ? (
                        <div className="pd-variant-cards-grid">
                            {variants.map((v, i) => {
                                const vImg = v.images?.[0]?.url
                                const vPrice = v.price?.amount ?? '—'
                                const vCurrency = v.price?.currency ?? 'INR'
                                const attrEntries = v.attributes ? Object.entries(v.attributes) : []
                                const stockNum = v.stock ?? '—'
                                const lowStock = typeof v.stock === 'number' && v.stock < 10
                                return (
                                    <div key={v._id || i} className="pd-variant-card">
                                        {/* Card image */}
                                        <div className="pd-vc-image-container">
                                            {vImg ? (
                                                <img src={vImg} alt={`variant-${i}`} className="pd-vc-image" />
                                            ) : (
                                                <div className="pd-vc-image-placeholder">No Image</div>
                                            )}
                                            <div className={`pd-vc-stock-status ${lowStock ? 'low' : 'in-stock'}`}>
                                                {lowStock ? 'Low Stock' : 'In Stock'}
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="pd-vc-details">
                                            {/* Attribute chips */}
                                            <div className="pd-vc-attributes">
                                                {attrEntries.length > 0 ? (
                                                    attrEntries.map(([k, val]) => (
                                                        <div key={k} className="pd-vc-attr-badge">
                                                            <span className="pd-vc-attr-key">{k}:</span>
                                                            <span className="pd-vc-attr-val">{val}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="pd-vc-no-attr">Standard</span>
                                                )}
                                            </div>

                                            {/* Price + stock count */}
                                            <div className="pd-vc-price-stock">
                                                <div className="pd-vc-price-block">
                                                    <span className="pd-vc-currency">{vCurrency === 'INR' ? '₹' : vCurrency}</span>
                                                    <span className="pd-vc-amount">{vPrice}</span>
                                                </div>
                                                <div className="pd-vc-stock-count">
                                                    <span className="pd-vc-qty">{stockNum}</span>
                                                    <span className="pd-vc-qty-label">Available</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="pd-inventory-empty">
                            No variants yet. Click <strong>+ Add Variant</strong> to create the first one.
                        </div>
                    )}

                    {/* ── Add Variant Form (slide-in) ── */}
                    {showVariantForm && (
                        <div className="pd-variant-form-panel pd-variant-panel-animate">
                            <div className="pd-variant-header">
                                <h3 className="pd-variant-form-title">Add New Variant</h3>
                                <button
                                    type="button"
                                    className="pd-variant-close"
                                    onClick={handleCloseForm}
                                    title="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            <form className="pd-variant-form" onSubmit={handleSubmit} onReset={handleReset}>

                                {/* Images */}
                                <div className="pd-variant-input-group">
                                    <label>
                                        Variant Images
                                        <span className="pd-label-hint">
                                            &nbsp;({formData.images.length}/{MAX_IMAGES})
                                        </span>
                                    </label>
                                    {formData.imagePreviews.length > 0 && (
                                        <div className="pd-image-preview-strip">
                                            {formData.imagePreviews.map((src, i) => (
                                                <div key={i} className="pd-preview-wrapper">
                                                    <img src={src} alt={`preview-${i}`} className="pd-preview-img" />
                                                    <button
                                                        type="button"
                                                        className="pd-preview-remove"
                                                        onClick={() => handleRemoveImage(i)}
                                                        title="Remove"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {formData.images.length < MAX_IMAGES && (
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="pd-variant-input file-input"
                                            onChange={handleImageChange}
                                        />
                                    )}
                                </div>

                                {/* Price + Currency */}
                                <div className="pd-variant-row">
                                    <div className="pd-variant-input-group" style={{ flex: 2 }}>
                                        <label>Price Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="e.g. 1299"
                                            className="pd-variant-input"
                                            value={formData.price.amount}
                                            onChange={handlePriceChange}
                                            required
                                        />
                                    </div>
                                    <div className="pd-variant-input-group" style={{ flex: 1 }}>
                                        <label>Currency</label>
                                        <select
                                            name="currency"
                                            className="pd-variant-input"
                                            value={formData.price.currency}
                                            onChange={handlePriceChange}
                                        >
                                            {['INR', 'USD', 'EUR', 'GBP', 'JPY'].map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="pd-variant-input-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        placeholder="Available quantity"
                                        className="pd-variant-input"
                                        value={formData.stock}
                                        onChange={handleStockChange}
                                        min={0}
                                    />
                                </div>

                                {/* Attributes */}
                                <div className="pd-variant-input-group">
                                    <label>
                                        Attributes
                                        <span className="pd-label-hint">&nbsp;(e.g. Size → M, Color → Red)</span>
                                    </label>
                                    {formData.attributes.map((attr, index) => (
                                        <div key={index} className="pd-attribute-row">
                                            <input
                                                type="text"
                                                placeholder="Key (e.g. Size)"
                                                className="pd-variant-input"
                                                value={attr.key}
                                                onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value (e.g. M)"
                                                className="pd-variant-input"
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="pd-attr-remove"
                                                onClick={() => handleRemoveAttribute(index)}
                                                title="Remove attribute"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="pd-attr-add" onClick={handleAddAttribute}>
                                        + Add Attribute
                                    </button>
                                </div>

                                {/* Form Actions */}
                                <div className="pd-variant-row pd-form-actions">
                                    <button type="reset" className="pd-btn pd-variant-reset">Reset</button>
                                    <button type="submit" className="pd-btn pd-variant-submit">Create Variant</button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default ProductDetailed