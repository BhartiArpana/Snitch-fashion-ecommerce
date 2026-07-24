import React, { useState } from 'react'
import '../style/addAddress.scss'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const initialForm = {
  country: 'India',
  name: '',
  mobileNumber: '',
  street: '',
  city: '',
  pincode: '',
  state: '',
  isDefault: false,
}

const AddAddress = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const {handleAddAddress} = useAuth()
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!/^\d{10}$/.test(form.mobileNumber)) newErrors.mobileNumber = 'Enter a valid 10-digit mobile number'
    if (!form.street.trim()) newErrors.street = 'Street address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode'
    if (!form.state.trim()) newErrors.state = 'State is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if(!user) navigate('/login')
    await handleAddAddress({form})
    // console.log('Address saved:', form)
  }

  return (
    <div className="wrapper">
      <div className="card">
        <h1 className="heading">Add a new address</h1>
        <p className="subheading">We’ll deliver your order here</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Arpana Singh"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="mobileNumber">Mobile number</label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.mobileNumber && <span className="error">{errors.mobileNumber}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="street">Street (House No, Building, Area)</label>
            <textarea
              id="street"
              name="street"
              rows={3}
              value={form.street}
              onChange={handleChange}
              placeholder="Flat / house no, building, street, area"
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {errors.pincode && <span className="error">{errors.pincode}</span>}
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Patna"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Bihar"
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="field">
            <label className="checkboxRow">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              <span>Set as default address</span>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="cancelBtn" onClick={() => setForm(initialForm)}>
              Cancel
            </button>
            <button type="submit" className="saveBtn">
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAddress