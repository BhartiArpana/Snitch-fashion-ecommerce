import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import '../styles/home.css'

const Home = () => {
    const {handleAllProducts} = useProduct()
    const products = useSelector(state=>state.product.product)
    const [theme, setTheme] = useState('light')

    useEffect(()=>{
        handleAllProducts()
    },[])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`home-container ${theme}`}>
            <header className="home-header">
                <h1 className="brand-title">SNITCH</h1>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
                </button>
            </header>
            
            <main className="product-grid">
                {products && products.length > 0 ? (
                    products.map((item, index) => (
                        <div key={index} className="product-card">
                            <div className="product-image-container">
                                <img 
                                    src={(item.image && item.image.length > 0) ? item.image[0].url : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80'} 
                                    alt={item.title || item.name || 'Product'} 
                                    className="product-image"
                                />
                                <div className="product-overlay">
                                    <button className="add-to-cart-btn">ADD TO CART</button>
                                </div>
                            </div>
                            <div className="product-details">
                                <h3 className="product-title">{item.title || item.name || 'SNITCH EXCLUSIVE ITEM'}</h3>
                                <p className="product-price">₹ {typeof item.price === 'object' && item.price !== null ? item.price.amount : (item.price || '1,999')}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="loading-state">Loading latest collection...</div>
                )}
            </main>
        </div>
    )
}

export default Home