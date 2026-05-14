import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hook/useProduct'
import '../styles/productDetailed.css'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'

const ProductDetailed = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const { handleGetProductById } = useProduct()
    const user = useSelector((state)=>state.auth.user)
    const theme = useSelector((state)=>state.theme.theme) || 'light'

    const [activeImageIndex, setActiveImageIndex] = useState(0)

    useEffect(() => {
        async function fetchDetails() {
            try {
                const data = await handleGetProductById(productId)
                setProduct(data)
                setActiveImageIndex(0) // Reset image index on product change
            } catch (error) {
                console.error("Failed to fetch product details", error)
            }
        }
        if (productId) {
            fetchDetails()
        }
    }, [productId])

    // Theme handled by Redux

    if (!product) {
        return (
            <div className={`product-detailed-container ${theme}`}>
                 <Navbar />
                <div className="pd-loading">Loading Product...</div>
            </div>
        )
    }

    const price = product.price && typeof product.price === 'object' 
        ? product.price.amount 
        : product.price

    const images = product.image || []
    const hasMultipleImages = images.length > 1
    const imageUrl = images.length > 0 
        ? images[activeImageIndex].url 
        : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'

    return (
        <div className={`product-detailed-container ${theme}`}>
            {/* Navbar handles brand, search, and theme toggle */}
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
                                    <img src={img.url} alt={`Thumbnail ${index + 1}`} className="pd-thumbnail-image" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pd-info-section">
                    <h1 className="pd-title">{product.title}</h1>
                    <p className="pd-price">₹ {price}</p>
                    
                    <div className="pd-description">
                        {product.description || "Premium quality clothing exclusive to Snitch. Discover the latest trends and elevate your wardrobe."}
                    </div>

                    <div className="pd-actions">
                        <button className="pd-btn pd-add-to-cart">
                            Add to Cart
                        </button>
                        <button className="pd-btn pd-buy-now">
                            Buy Now
                        </button>
                    </div>
                </div>
            </main>

            {user?.role === 'seller' && (
                <section className="pd-bottom-variant-section">
                    <div className="pd-variant-container">
                        <h2 className="pd-variant-title">Seller Panel: Add New Variant</h2>
                        <div className="pd-variant-form">
                            <div className="pd-variant-input-group">
                                <label>Variant Image</label>
                                <input type="file" accept="image/*" className="pd-variant-input file-input" />
                            </div>
                            <div className="pd-variant-row">
                                <input type="number" placeholder="Price (₹)" className="pd-variant-input" />
                                <input type="number" placeholder="Stocks Available" className="pd-variant-input" />
                            </div>
                            <input type="text" placeholder="Attribute (e.g. Size M, Color Red)" className="pd-variant-input" />
                            <button className="pd-btn pd-variant-submit">
                                Create Variant
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProductDetailed