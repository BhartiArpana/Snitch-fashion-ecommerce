import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProduct } from '../hook/useProduct'
import '../styles/productDetailed.css'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'

const MAX_IMAGES = 7

// Initial form state mirroring the Mongoose variant schema
const initialFormData = {
    images: [],          // Array of File objects (up to 7)
    imagePreviews: [],   // Array of preview URLs (derived, not sent to backend)
    price: {
        amount: '',
        currency: 'INR',
    },
    stock: '',
    attributes: [{ key: '', value: '' }], // Map<String,String> as key-value pairs
}

const ProductDetailed = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const { handleGetProductById,handleAddProductVariant } = useProduct()
    const user = useSelector((state) => state.auth.user)
    const theme = useSelector((state) => state.theme.theme) || 'light'

    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [formData, setFormData] = useState(initialFormData)
    const fileInputRef = useRef(null)

    useEffect(() => {
        async function fetchDetails() {
            try {
                const data = await handleGetProductById(productId)
                setProduct(data)
                setActiveImageIndex(0)
            } catch (error) {
                console.error('Failed to fetch product details', error)
            }
        }
        if (productId) fetchDetails()
    }, [productId])

    if (!product) {
        return (
            <div className={`product-detailed-container ${theme}`}>
                <Navbar />
                <div className="pd-loading">Loading Product...</div>
            </div>
        )
    }

    const price =
        product.price && typeof product.price === 'object'
            ? product.price.amount
            : product.price

    const images = product.image || []
    const hasMultipleImages = images.length > 1
    const imageUrl =
        images.length > 0
            ? images[activeImageIndex].url
            : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'

    // ── Form Handlers ──────────────────────────────────────────────────────────

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const combined = [...formData.images, ...files].slice(0, MAX_IMAGES)
        const previews = combined.map((f) =>
            f instanceof File ? URL.createObjectURL(f) : f
        )
        setFormData((prev) => ({ ...prev, images: combined, imagePreviews: previews }))
        // Reset file input so the same file can be re-selected if removed
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        const newPreviews = formData.imagePreviews.filter((_, i) => i !== index)
        setFormData((prev) => ({ ...prev, images: newImages, imagePreviews: newPreviews }))
    }

    const handlePriceChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            price: { ...prev.price, [name]: value },
        }))
    }

    const handleStockChange = (e) => {
        setFormData((prev) => ({ ...prev, stock: e.target.value }))
    }

    // Attribute (Map) handlers
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

    const handleSubmit =async (e) => {
        e.preventDefault()

        // Build the payload matching the Mongoose variant schema:
        // attributes is a Map<String,String>
        const attributesMap = {}
        formData.attributes.forEach(({ key, value }) => {
            if (key.trim()) attributesMap[key.trim()] = value.trim()
        })

        const payload = {
            images: formData.images, // File objects — wrap in FormData on API call
            price: {
                amount: formData.price.amount,
                currency: formData.price.currency,
            },
            stock: Number(formData.stock),
            attributes: attributesMap,
        }

        console.log('Variant payload:', payload)
        // TODO: pass `payload` to your API hook (e.g. handleCreateVariant(productId, payload))
        await handleAddProductVariant(productId, payload) 
    }

    const handleReset = () => {
        setFormData(initialFormData)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className={`product-detailed-container ${theme}`}>
            <Navbar />

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
                            {images.map((img, index) => (
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
                    <p className="pd-price">₹ {price}</p>
                    <div className="pd-description">
                        {product.description ||
                            'Premium quality clothing exclusive to Snitch. Discover the latest trends and elevate your wardrobe.'}
                    </div>
                    <div className="pd-actions">
                        <button className="pd-btn pd-add-to-cart">Add to Cart</button>
                        <button className="pd-btn pd-buy-now">Buy Now</button>
                    </div>
                </div>
            </main>

            {user?.role === 'seller' && (
                <section className="pd-bottom-variant-section">
                    <div className="pd-variant-container">
                        <h2 className="pd-variant-title">Seller Panel: Add New Variant</h2>

                        <form className="pd-variant-form" onSubmit={handleSubmit} onReset={handleReset}>

                            {/* ── Images (up to 7) ── */}
                            <div className="pd-variant-input-group">
                                <label>
                                    Variant Images
                                    <span className="pd-label-hint">
                                        &nbsp;({formData.images.length}/{MAX_IMAGES} selected)
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
                                                    title="Remove image"
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

                            {/* ── Price ── */}
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

                            {/* ── Stock ── */}
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

                            {/* ── Attributes (Map<String,String>) ── */}
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
                                            onChange={(e) =>
                                                handleAttributeChange(index, 'key', e.target.value)
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value (e.g. M)"
                                            className="pd-variant-input"
                                            value={attr.value}
                                            onChange={(e) =>
                                                handleAttributeChange(index, 'value', e.target.value)
                                            }
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

                                <button
                                    type="button"
                                    className="pd-attr-add"
                                    onClick={handleAddAttribute}
                                >
                                    + Add Attribute
                                </button>
                            </div>

                            {/* ── Actions ── */}
                            <div className="pd-variant-row pd-form-actions">
                                <button type="reset" className="pd-btn pd-variant-reset">
                                    Reset
                                </button>
                                <button type="submit" className="pd-btn pd-variant-submit">
                                    Create Variant
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProductDetailed