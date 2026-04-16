// ===================== CreateProduct.jsx =====================
import React, { useState, useEffect } from 'react'
import { useProduct } from '../hook/useProduct'
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../theme/state/theme.slice";
import '../styles/createProduct.css'


const CreateProduct = () => {
  const { handleCreateProduct } = useProduct()
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme.theme)

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    images: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 7)
    setFormData({ ...formData, images: files })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
     const data = new FormData()

  data.append("title", formData.title)
  data.append("description", formData.description)
  data.append("priceAmount", formData.priceAmount)
  data.append("priceCurrency", formData.priceCurrency)

  formData.images.forEach((img) => {
    data.append("images", img) // ⚠️ IMPORTANT
  })

  handleCreateProduct(data) 
  }

  return (
    <div className="create-product-container">

      {/* Theme Toggle */}
      <div
        className={`toggle ${theme}`}
        onClick={() => dispatch(toggleTheme())}
      >
        <div className="circle"></div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Create Product</h2>

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          required
        />

        <div className="price-row">
          <input
            type="number"
            name="priceAmount"
            placeholder="Price"
            onChange={handleChange}
            required
          />

          <select name="priceCurrency" onChange={handleChange}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="preview">
          {formData.images.map((img, i) => (
            <img key={i} src={URL.createObjectURL(img)} alt="preview" />
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Create Product
        </button>
      </form>
    </div>
  )
}

export default CreateProduct


// ===================== createProduct.css =====================

